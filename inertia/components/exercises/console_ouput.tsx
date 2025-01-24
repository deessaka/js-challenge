import { cn } from '~/lib/lib'
import { 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Terminal, 
  ChevronRight,
  ArrowRight,
  AlertCircle
} from 'lucide-react'

interface ConsoleMessage {
  type: 'error' | 'success' | 'info' | 'warning'
  content: string
  details?: string[]
}

function parseOutput(output: string): ConsoleMessage {
  // Check if it's a test result
  if (output.startsWith('✅')) {
    return { 
      type: 'success', 
      content: 'Tests passed successfully!',
      details: ['All test cases are passing', 'Moving to next exercise...']
    }
  }
  
  if (output.startsWith('❌')) {
    try {
      const [message, ...rest] = output.split('\n')
      const results = JSON.parse(rest.join('\n'))
      
      // Format test results in a more readable way
      const details = results.map((result: any) => {
        if (result.success) {
          return `[PASS] ${result.description}`
        } else {
          return `[FAIL] ${result.description}\n       Expected: ${result.expected}\n       Received: ${result.received}`
        }
      })
      
      return {
        type: 'error',
        content: 'Some tests failed',
        details
      }
    } catch {
      return { 
        type: 'error', 
        content: 'Test execution failed',
        details: [output]
      }
    }
  }

  // Handle runtime errors
  if (output.includes('Error:') || output.includes('TypeError:')) {
    return { 
      type: 'error', 
      content: 'Runtime Error',
      details: [output]
    }
  }

  // Handle warnings
  if (output.includes('Warning:')) {
    return {
      type: 'warning',
      content: 'Warning',
      details: [output]
    }
  }

  // Default case - treat as info
  return { 
    type: 'info', 
    content: 'Output',
    details: [output]
  }
}

const IconByType = {
  error: XCircle,
  success: CheckCircle2,
  warning: AlertTriangle,
  info: Terminal
}

const FlagByType = {
  error: 'ERROR',
  success: 'SUCCESS',
  warning: 'WARNING',
  info: 'INFO'
}

const ColorByType = {
  error: "bg-red-950/30 text-red-200 border-red-800/50",
  success: "bg-green-950/30 text-green-200 border-green-800/50",
  warning: "bg-yellow-950/30 text-yellow-200 border-yellow-800/50",
  info: "bg-gray-900/50 text-gray-200 border-gray-800/50"
}

export const Output = ({ output }: { output: string }) => {
  const message = parseOutput(output)
  const Icon = IconByType[message.type]
  
  return (
    <div className="flex flex-col h-full px-2 py-4">
      <div className="font-semibold mb-2 flex items-center gap-2">
        <Terminal className="w-4 h-4" />
        <span>Console</span>
      </div>
      <div className={cn(
        "flex flex-col gap-2 rounded-lg p-4 font-mono text-sm overflow-auto border",
        ColorByType[message.type]
      )}>
        {/* Header */}
        <div className="flex items-center gap-2 pb-2 border-b border-current/20">
          <Icon className="w-5 h-5" />
          <span className="font-semibold">{message.content}</span>
          <span className="ml-auto px-2 py-0.5 text-xs rounded-full border border-current/30">
            {FlagByType[message.type]}
          </span>
        </div>
        
        {/* Details */}
        {message.details && (
          <div className="pt-2 space-y-2">
            {message.details.map((detail, index) => (
              <div key={index} className="flex gap-2 items-start">
                <ChevronRight className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span className="whitespace-pre-wrap">{detail}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
