import { cn } from '~/lib/utils'
import { CheckCircle2, XCircle, AlertTriangle, Terminal, ChevronRight, Info } from 'lucide-react'

interface ConsoleMessage {
  type: 'error' | 'success' | 'info' | 'warning'
  content: string
  details?: string[]
}

function parseOutput(output: string): ConsoleMessage {
  if (!output) {
    return { type: 'info', content: 'Prêt à exécuter.', details: [] }
  }

  // Check if it's a test result (Success)
  if (output.includes('✅')) {
    return {
      type: 'success',
      content: 'Exécution réussie !',
      details: ['Tous les tests unitaires sont au vert.', 'Passage au défi suivant...'],
    }
  }

  // Check if it's a test result (Failure) parsing JSON arrays
  if (output.includes('❌') || output.trim().startsWith('[')) {
    try {
      const jsonStr = output.replace('❌', '').trim()
      const results = JSON.parse(jsonStr)
      if (Array.isArray(results)) {
        const details = results.map((result: any) => {
          if (result.success || result.passed) {
            return `✅ ${result.description}`
          } else {
            return `❌ ${result.description}\n   Attendu : ${result.expected || '?'}\n   Obtenu  : ${result.received || result.error || '?'}`
          }
        })
        return {
          type: 'error',
          content: 'Certains tests ont échoué',
          details,
        }
      }
    } catch {
      // fallback
    }
  }

  // Handle runtime errors
  if (
    output.includes('Error:') ||
    output.includes('TypeError:') ||
    output.includes('ReferenceError:')
  ) {
    return {
      type: 'error',
      content: "Erreur d'exécution",
      details: output.split('\n').filter(Boolean),
    }
  }

  // Handle warnings
  if (output.includes('Warning:')) {
    return {
      type: 'warning',
      content: 'Avertissement',
      details: output.split('\n').filter(Boolean),
    }
  }

  // Default case - treat as standard output (stdout)
  return {
    type: 'info',
    content: 'Sortie Standard (stdout)',
    details: output.split('\n').filter(Boolean),
  }
}

const IconByType = {
  error: XCircle,
  success: CheckCircle2,
  warning: AlertTriangle,
  info: Info,
}

const FlagByType = {
  error: 'ERREUR',
  success: 'SUCCÈS',
  warning: 'ATTENTION',
  info: 'INFO',
}

const ColorByType = {
  error: 'bg-red-500/10 text-red-100 border-red-500/20 shadow-[0_0_15px_rgba(239,68,68,0.1)]',
  success:
    'bg-emerald-500/10 text-emerald-100 border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]',
  warning:
    'bg-amber-500/10 text-amber-100 border-amber-500/20 shadow-[0_0_15px_rgba(245,158,11,0.1)]',
  info: 'bg-indigo-500/10 text-indigo-100 border-indigo-500/20 shadow-[0_0_15px_rgba(99,102,241,0.1)]',
}

export const Output = ({ output }: { output: string }) => {
  const message = parseOutput(output)
  const Icon = IconByType[message.type]

  return (
    <div className="flex flex-col h-full p-6 overflow-hidden">
      <div className="font-semibold text-gray-400 mb-3 flex items-center gap-2 uppercase tracking-wider text-xs shrink-0">
        <Terminal className="w-4 h-4 text-indigo-400" />
        <span>Console de Sortie</span>
      </div>

      <div
        className={cn(
          'flex flex-col flex-1 gap-3 rounded-xl p-5 font-mono text-sm overflow-hidden border backdrop-blur-md transition-all duration-300',
          ColorByType[message.type]
        )}
      >
        {/* Header */}
        <div className="flex items-center gap-3 pb-3 border-b border-current/20 shrink-0">
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-current/10 shrink-0">
            <Icon className="w-5 h-5" />
          </div>
          <span className="font-semibold text-base">{message.content}</span>
          <span className="ml-auto px-3 py-1 text-[10px] rounded-full border border-current/30 font-bold bg-current/10 tracking-widest">
            {FlagByType[message.type]}
          </span>
        </div>

        {/* Details */}
        <div className="pt-2 space-y-3 flex-1 overflow-y-auto custom-scrollbar">
          {message.details && message.details.length > 0 ? (
            message.details.map((detail, index) => (
              <div
                key={index}
                className="flex gap-3 items-start p-3 rounded-lg bg-black/20 font-medium"
              >
                <ChevronRight className="w-5 h-5 mt-0.5 shrink-0 opacity-50" />
                <span className="whitespace-pre-wrap leading-relaxed">{detail}</span>
              </div>
            ))
          ) : (
            <div className="flex items-center h-full justify-center text-gray-400 opacity-60">
              Tapez du code et appuyez sur 'Tester' ou imprimez via console.log().
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
