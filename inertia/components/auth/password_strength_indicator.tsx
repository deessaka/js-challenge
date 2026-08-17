import { CheckCircle2, XCircle } from 'lucide-react'
import { motion } from 'framer-motion'

export interface PasswordStrength {
  score: number
  label: string
  color: string
  checks: {
    length: boolean
    uppercase: boolean
    lowercase: boolean
    number: boolean
    special: boolean
  }
}

export function calculatePasswordStrength(password: string): PasswordStrength {
  const checks = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /\d/.test(password),
    special: /[@$!%*?&]/.test(password),
  }
  const score = Object.values(checks).filter(Boolean).length

  let label = 'Très faible'
  let color = 'bg-destructive'

  if (score === 5) {
    label = 'Fort'
    color = 'bg-accent'
  } else if (score >= 4) {
    label = 'Moyen'
    color = 'bg-amber-500'
  } else if (score >= 2) {
    label = 'Faible'
    color = 'bg-orange-500'
  }

  return { score, label, color, checks }
}

interface PasswordStrengthIndicatorProps {
  password: string
  className?: string
}

export function PasswordStrengthIndicator({
  password,
  className = '',
}: PasswordStrengthIndicatorProps) {
  if (!password) return null

  const strength = calculatePasswordStrength(password)

  return (
    <motion.div
      initial={{ opacity: 0, y: -5 }}
      animate={{ opacity: 1, y: 0 }}
      className={`space-y-2 ${className}`}
    >
      <div className="flex items-center gap-2">
        <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(strength.score / 5) * 100}%` }}
            className={`h-full ${strength.color} transition-all duration-300`}
          />
        </div>
        <span className="text-sm text-muted-foreground">{strength.label}</span>
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
        <PasswordRequirement met={strength.checks.length} label="8 caractères min." />
        <PasswordRequirement met={strength.checks.uppercase} label="1 majuscule" />
        <PasswordRequirement met={strength.checks.lowercase} label="1 minuscule" />
        <PasswordRequirement met={strength.checks.number} label="1 chiffre" />
        <PasswordRequirement met={strength.checks.special} label="1 caractère spécial" />
      </div>
    </motion.div>
  )
}

interface PasswordRequirementProps {
  met: boolean
  label: string
}

function PasswordRequirement({ met, label }: PasswordRequirementProps) {
  return (
    <div
      className={
        met
          ? 'flex items-center gap-1 text-accent'
          : 'flex items-center gap-1 text-muted-foreground'
      }
    >
      {met ? (
        <CheckCircle2 className="h-3 w-3" aria-hidden="true" />
      ) : (
        <XCircle className="h-3 w-3" aria-hidden="true" />
      )}
      <span>{label}</span>
    </div>
  )
}
