import BaseLayout from '#components/layouts/base_layout'
import { useForm, Link, usePage } from '@inertiajs/react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Mail, AlertCircle, CheckCircle2 } from 'lucide-react'

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

export default function RequestPasswordReset() {
  const { flash } = usePage().props as any
  const { data, setData, post, processing, errors, wasSuccessful } = useForm({
    email: '',
  })

  function submit(e: React.FormEvent) {
    e.preventDefault()
    post('/password/request-reset')
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
            <span>Retour à la connexion</span>
          </Link>

          <div className="max-h-[90vh] overflow-y-auto">
            <div className="p-8 space-y-6">
            <div className="flex flex-col items-center gap-2">
              <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center">
                <Mail className="w-8 h-8 text-white/60" />
              </div>
              <h1 className="text-2xl font-medium text-white">Mot de passe oublié</h1>
              <p className="text-sm text-white/60 text-center max-w-xs">
                Entrez votre adresse email et nous vous enverrons un lien pour réinitialiser votre
                mot de passe.
              </p>
            </div>

            {/* Flash Messages */}
            {flash?.error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm flex items-start gap-2"
              >
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                <span>{flash.error}</span>
              </motion.div>
            )}

            {flash?.success && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-green-500/10 border border-green-500/20 rounded-xl text-green-400 text-sm flex items-start gap-2"
              >
                <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
                <span>{flash.success}</span>
              </motion.div>
            )}

            {wasSuccessful && !flash?.error ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-4"
              >
                <div className="p-6 bg-green-500/10 border border-green-500/20 rounded-xl text-center space-y-3">
                  <CheckCircle2 className="w-12 h-12 text-green-400 mx-auto" />
                  <h3 className="text-lg font-medium text-white">Email envoyé !</h3>
                  <p className="text-sm text-white/80">
                    Si un compte existe avec cette adresse email, vous recevrez un lien de
                    réinitialisation dans quelques instants.
                  </p>
                  <p className="text-xs text-white/60">
                    Vérifiez également votre dossier spam.
                  </p>
                </div>

                <Link
                  href="/auth/login"
                  className="block w-full h-12 flex items-center justify-center bg-white/10 hover:bg-white/20 text-white text-sm font-medium rounded-xl transition-colors"
                >
                  Retour à la connexion
                </Link>
              </motion.div>
            ) : (
              <form onSubmit={submit} className="space-y-4">
                <div>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      value={data.email}
                      className="w-full h-12 pl-12 pr-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-white/20"
                      placeholder="Votre adresse email"
                      onChange={(e) => setData('email', e.target.value)}
                      autoComplete="email"
                      autoFocus
                    />
                  </div>
                  {errors.email && (
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="text-red-400 text-sm mt-2 text-left flex items-center gap-2"
                    >
                      <AlertCircle className="w-4 h-4" />
                      {errors.email}
                    </motion.div>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full h-12 bg-white/10 hover:bg-white/20 text-white text-sm font-medium rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={processing}
                >
                  {processing ? 'Envoi en cours...' : 'Envoyer le lien de réinitialisation'}
                </button>
              </form>
            )}

            {!wasSuccessful && (
              <div className="text-center space-y-2">
                <Link
                  href="/auth/login"
                  className="text-sm text-white/60 hover:text-white transition-colors block"
                >
                  Retour à la connexion
                </Link>
                <Link
                  href="/auth/register"
                  className="text-sm text-white/60 hover:text-white transition-colors block"
                >
                  Pas encore de compte ? <span className="font-medium">S'inscrire</span>
                </Link>
              </div>
            )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

RequestPasswordReset.layout = (page: any) => <BaseLayout>{page}</BaseLayout>
