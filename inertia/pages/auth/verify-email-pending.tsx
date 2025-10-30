import BaseLayout from '#components/layouts/base_layout'
import { useForm, Link, usePage } from '@inertiajs/react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, ArrowLeft, AlertCircle, CheckCircle2, AlertTriangle, Clock } from 'lucide-react'
import { useState, useEffect } from 'react'

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
}

const modalVariants = {
  hidden: { opacity: 0, scale: 0.9, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: 'spring', duration: 0.5 },
  },
  exit: {
    opacity: 0,
    scale: 0.9,
    y: 20,
    transition: { duration: 0.2 },
  },
}

interface VerifyEmailPendingProps {
  email: string
  flash?: { success?: string; error?: string }
}

export default function VerifyEmailPending() {
  const { email, flash } = usePage().props as VerifyEmailPendingProps
  const { data, setData, post, processing } = useForm({
    email: email,
  })

  const [countdown, setCountdown] = useState(0)
  const [resendDisabled, setResendDisabled] = useState(false)
  const [localSuccess, setLocalSuccess] = useState<string | null>(null)
  const [localError, setLocalError] = useState<string | null>(null)

  // Gestion du compte à rebours
  useEffect(() => {
    let timer: NodeJS.Timeout
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000)
    } else if (resendDisabled) {
      setResendDisabled(false)
    }
    return () => clearTimeout(timer)
  }, [countdown, resendDisabled])

  function handleResend(e: React.FormEvent) {
    e.preventDefault()

    // Désactiver le bouton et démarrer le compte à rebours
    setResendDisabled(true)
    setCountdown(60)
    setLocalSuccess(null)
    setLocalError(null)

    post('/auth/resend-verification', {
      preserveScroll: true,
      onSuccess: () => {
        setLocalSuccess('Email de vérification renvoyé avec succès. Vérifiez votre boîte de réception.')
      },
      onError: (errors) => {
        setLocalError(errors.email || 'Une erreur est survenue lors du renvoi de l\'email.')
        setResendDisabled(false)
        setCountdown(0)
      },
    })
  }

  return (
    <AnimatePresence>
      <motion.div
        initial="hidden"
        animate="visible"
        exit="hidden"
        variants={overlayVariants}
        className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4"
      >
        <motion.div
          variants={modalVariants}
          className="w-full max-w-md bg-[#1a1f2d]/80 backdrop-blur-sm rounded-2xl shadow-2xl relative"
        >
          <Link
            href="/auth/login"
            className="absolute top-4 left-4 flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors z-10"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Retour</span>
          </Link>

          <div className="max-h-[90vh] overflow-y-auto">
            <div className="p-8 space-y-6">
              {/* Header avec icône */}
              <div className="flex flex-col items-center gap-4">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', delay: 0.2, duration: 0.6 }}
                  className="w-20 h-20 bg-blue-500/10 rounded-full flex items-center justify-center"
                >
                  <Mail className="w-10 h-10 text-blue-400" />
                </motion.div>
                <div className="text-center space-y-2">
                  <h1 className="text-2xl font-medium text-white">Vérifiez votre email</h1>
                  <p className="text-white/60 text-sm">
                    Nous avons envoyé un email de vérification à
                  </p>
                  <p className="text-white font-medium">{email}</p>
                </div>
              </div>

              {/* Description */}
              <div className="text-center text-white/80 text-sm">
                Veuillez consulter votre boîte de réception et cliquer sur le lien de vérification
                pour activer votre compte.
              </div>

              {/* Warning box - Expiration */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-400 text-sm flex items-start gap-3"
              >
                <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">Attention</p>
                  <p className="text-amber-400/80 mt-1">
                    Le lien de vérification expirera dans 24 heures
                  </p>
                </div>
              </motion.div>

              {/* Flash Messages */}
              {(flash?.success || localSuccess) && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-green-500/10 border border-green-500/20 rounded-xl text-green-400 text-sm flex items-start gap-2"
                >
                  <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
                  <span>{flash?.success || localSuccess}</span>
                </motion.div>
              )}

              {(flash?.error || localError) && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm flex items-start gap-2"
                >
                  <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                  <span>{flash?.error || localError}</span>
                </motion.div>
              )}

              {/* Resend button */}
              <form onSubmit={handleResend}>
                <button
                  type="submit"
                  className="w-full h-12 bg-white/5 hover:bg-white/10 text-white/80 hover:text-white text-sm font-medium rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  disabled={processing || resendDisabled}
                >
                  {processing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                      <span>Envoi en cours...</span>
                    </>
                  ) : countdown > 0 ? (
                    <>
                      <Clock className="w-4 h-4" />
                      <span>Renvoyer dans {countdown}s</span>
                    </>
                  ) : (
                    <span>Je n'ai pas reçu l'email</span>
                  )}
                </button>
              </form>

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/10"></div>
                </div>
              </div>

              {/* Links */}
              <div className="space-y-3 text-center">
                <Link
                  href="/auth/login"
                  className="block text-sm text-white/60 hover:text-white transition-colors"
                >
                  Retour à la connexion
                </Link>
                <Link
                  href="/auth/register"
                  className="block text-sm text-white/60 hover:text-white transition-colors"
                >
                  S'inscrire avec un autre email
                </Link>
              </div>

              {/* Helper text */}
              <div className="text-center text-xs text-white/40 pt-2">
                <p>Vous ne trouvez pas l'email ?</p>
                <p className="mt-1">Vérifiez votre dossier spam ou courrier indésirable</p>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

VerifyEmailPending.layout = (page: any) => <BaseLayout>{page}</BaseLayout>
