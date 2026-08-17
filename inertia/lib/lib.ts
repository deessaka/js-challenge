import axios from 'axios'
import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export interface ExecutionResult {
  run: {
    stdout: string
    stderr: string
    output: string
    code: number
  }
}

/**
 * Executes JavaScript code client-side inside an isolated Web Worker sandbox.
 * Captures console.log/info/warn/error output and handles timeouts.
 */
function executeInWebWorker(sourceCode: string, timeoutMs = 3000): Promise<ExecutionResult> {
  return new Promise((resolve) => {
    if (
      typeof window === 'undefined' ||
      typeof Worker === 'undefined' ||
      typeof Blob === 'undefined'
    ) {
      resolve({
        run: {
          stdout: '',
          stderr: 'Web Worker non disponible dans cet environnement.',
          output: 'Erreur : Web Worker non disponible dans cet environnement.',
          code: 1,
        },
      })
      return
    }

    const workerCode = `
      self.onmessage = function(e) {
        var sourceCode = e.data.code;
        var logs = [];
        var errors = [];

        function formatArg(arg) {
          if (arg === undefined) return 'undefined';
          if (arg === null) return 'null';
          if (typeof arg === 'function') return arg.toString();
          if (typeof arg === 'symbol') return arg.toString();
          if (typeof arg === 'bigint') return arg.toString() + 'n';
          if (typeof arg === 'object') {
            try {
              var seen = new WeakSet();
              return JSON.stringify(arg, function(k, v) {
                if (typeof v === 'object' && v !== null) {
                  if (seen.has(v)) return '[Circular]';
                  seen.add(v);
                }
                return v;
              }, 2);
            } catch (err) {
              return Object.prototype.toString.call(arg);
            }
          }
          return String(arg);
        }

        var customConsole = {
          log: function() {
            var args = Array.prototype.slice.call(arguments);
            logs.push(args.map(formatArg).join(' '));
          },
          info: function() {
            var args = Array.prototype.slice.call(arguments);
            logs.push(args.map(formatArg).join(' '));
          },
          warn: function() {
            var args = Array.prototype.slice.call(arguments);
            logs.push('Warning: ' + args.map(formatArg).join(' '));
          },
          error: function() {
            var args = Array.prototype.slice.call(arguments);
            errors.push('Error: ' + args.map(formatArg).join(' '));
          },
          dir: function(item) {
            logs.push(formatArg(item));
          },
          table: function(item) {
            logs.push(formatArg(item));
          }
        };

        try {
          var runner = new Function('console', '"use strict";\\n' + sourceCode);
          var evalResult = runner(customConsole);
          if (evalResult !== undefined && logs.length === 0 && errors.length === 0) {
            logs.push(formatArg(evalResult));
          }
          self.postMessage({ logs: logs, errors: errors, success: errors.length === 0 });
        } catch (err) {
          errors.push(err.name + ': ' + err.message);
          self.postMessage({ logs: logs, errors: errors, success: false });
        }
      };
    `

    const blob = new Blob([workerCode], { type: 'application/javascript' })
    const workerUrl = URL.createObjectURL(blob)
    const worker = new Worker(workerUrl)

    let isFinished = false

    const timer = setTimeout(() => {
      if (!isFinished) {
        isFinished = true
        worker.terminate()
        URL.revokeObjectURL(workerUrl)
        resolve({
          run: {
            stdout: '',
            stderr: 'Error: Temps d’exécution dépassé (timeout 3s). Vérifiez vos boucles infinies.',
            output: 'Error: Temps d’exécution dépassé (timeout 3s). Vérifiez vos boucles infinies.',
            code: 1,
          },
        })
      }
    }, timeoutMs)

    worker.onmessage = (e) => {
      if (!isFinished) {
        isFinished = true
        clearTimeout(timer)
        worker.terminate()
        URL.revokeObjectURL(workerUrl)

        const { logs, errors, success } = e.data
        const stdout = logs.join('\n')
        const stderr = errors.join('\n')
        const output = stderr ? stderr : stdout || 'Aucune sortie générée.'

        resolve({
          run: {
            stdout,
            stderr,
            output,
            code: success ? 0 : 1,
          },
        })
      }
    }

    worker.onerror = (err) => {
      if (!isFinished) {
        isFinished = true
        clearTimeout(timer)
        worker.terminate()
        URL.revokeObjectURL(workerUrl)

        const errorText = `Error: ${err.message || 'Erreur lors de l’exécution du script.'}`
        resolve({
          run: {
            stdout: '',
            stderr: errorText,
            output: errorText,
            code: 1,
          },
        })
      }
    }

    worker.postMessage({ code: sourceCode })
  })
}

// Function to execute code using a self-hosted Piston API or fallback to sandboxed Web Worker
export async function executeCode(language: string, sourceCode: string): Promise<ExecutionResult> {
  const customPistonUrl =
    (typeof import.meta !== 'undefined' && import.meta.env?.VITE_PISTON_URL) || ''

  if (customPistonUrl) {
    try {
      const response = await axios.post(`${customPistonUrl}/execute`, {
        language,
        version: '*',
        files: [
          {
            name: 'main',
            content: sourceCode,
          },
        ],
        stdin: '',
        args: [],
      })
      return response.data
    } catch (error) {
      console.error('Error executing code with custom Piston:', error)
      throw error
    }
  }

  // Default: execute securely client-side in an isolated Web Worker
  return executeInWebWorker(sourceCode)
}
