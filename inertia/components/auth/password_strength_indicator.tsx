import { motion } from 'framer-motion'
import { CheckCircle2, XCircle } from 'lucide-react'

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
  let color = 'bg-red-500'

  if (score === 5) {
    label = 'Fort'
    color = 'bg-green-500'
  } else if (score >= 4) {
    label = 'Moyen'
    color = 'bg-yellow-500'
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
        <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(strength.score / 5) * 100}%` }}
            className={`h-full ${strength.color} transition-all duration-300`}
          />
        </div>
        <span className="text-sm text-white/60">{strength.label}</span>
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs">
        <PasswordRequirement
          met={strength.checks.length}
          label="8 caractères min."
        />
        <PasswordRequirement
          met={strength.checks.uppercase}
          label="1 majuscule"
        />
        <PasswordRequirement
          met={strength.checks.lowercase}
          label="1 minuscule"
        />
        <PasswordRequirement
          met={strength.checks.number}
          label="1 chiffre"
        />
        <PasswordRequirement
          met={strength.checks.special}
          label="1 caractère spécial"
        />
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
      className={`flex items-center gap-1 ${met ? 'text-green-400' : 'text-white/40'}`}
    >
      {met ? (
        <CheckCircle2 className="w-3 h-3" />
      ) : (
        <XCircle className="w-3 h-3" />
      )}
      <span>{label}</span>
    </div>
  )
}
