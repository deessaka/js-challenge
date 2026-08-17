import { createInterface } from 'node:readline/promises'
import { stdin as input, stdout as output } from 'node:process'

export async function ask(question: string): Promise<string> {
  const readline = createInterface({ input, output })
  try {
    return (await readline.question(question)).trim()
  } finally {
    readline.close()
  }
}

export async function askSecret(question: string): Promise<string> {
  if (!input.isTTY || !output.isTTY || !input.setRawMode) {
    return ask(`${question} `)
  }

  output.write(question)
  input.setRawMode(true)
  input.resume()

  return new Promise((resolve) => {
    let value = ''
    const onData = (chunk: Buffer) => {
      const character = chunk.toString('utf8')
      if (character === '\u0003') {
        input.setRawMode?.(false)
        input.pause()
        input.off('data', onData)
        output.write('\n')
        process.exitCode = 130
        resolve('')
        return
      }
      if (character === '\r' || character === '\n') {
        input.setRawMode?.(false)
        input.pause()
        input.off('data', onData)
        output.write('\n')
        resolve(value)
        return
      }
      if (character === '\u007f') {
        if (value.length) {
          value = value.slice(0, -1)
          output.write('\b \b')
        }
        return
      }
      value += character
      output.write('*')
    }

    input.on('data', onData)
  })
}

export function info(message: string): void {
  console.log(message)
}

export function success(message: string): void {
  console.log(`✓ ${message}`)
}

export function warning(message: string): void {
  console.error(`! ${message}`)
}

export function error(message: string): void {
  console.error(`✗ ${message}`)
}

export function table(rows: Array<Record<string, string>>): void {
  if (!rows.length) return
  const columns = Object.keys(rows[0])
  const widths = columns.map((column) =>
    Math.max(column.length, ...rows.map((row) => row[column].length))
  )
  console.log(columns.map((column, index) => column.padEnd(widths[index])).join('  '))
  console.log(widths.map((width) => '-'.repeat(width)).join('  '))
  for (const row of rows) {
    console.log(columns.map((column, index) => row[column].padEnd(widths[index])).join('  '))
  }
}
