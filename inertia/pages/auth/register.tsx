import BaseLayout from '#components/layouts/base_layout'
import { useForm, Link, usePage } from '@inertiajs/react'
import { motion, AnimatePresence } from 'framer-motion'
import { Github, ArrowLeft, Eye, EyeOff, CheckCircle2, XCircle, AlertCircle } from 'lucide-react'
import { useState } from 'react'
import { PasswordStrengthIndicator } from '~/components/auth/password_strength_indicator'

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

export default function Register() {
  const { flash } = usePage().props as any
  const { data, setData, post, processing, errors } = useForm({
    username: '',
    email: '',
    password: '',
    password_confirmation: '',
  })

  const [showPassword, setShowPassword] = useState(false)
  const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false)

  function submit(e: React.FormEvent) {
    e.preventDefault()
    post('/auth/register')
  }

  function loginWithGithub() {
    window.location.href = '/oauth/github/redirect'
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
            href="/"
            className="absolute top-4 left-4 flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors z-10"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Retour</span>
          </Link>

          <div className="max-h-[90vh] overflow-y-auto">
            <div className="p-8 space-y-6">
            <div className="flex flex-col items-center gap-2">
              <span className="text-2xl font-mono text-white">{'</>'}</span>
              <h1 className="text-2xl font-medium text-white">JS Challenge</h1>
              <h2 className="text-xl font-medium text-white/80">Inscription</h2>
            </div>

            {/* Flash Messages */}
            {flash?.error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm flex items-start gap-2"
              >
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <span>{flash.error}</span>
              </motion.div>
            )}

            {flash?.success && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-green-500/10 border border-green-500/20 rounded-xl text-green-400 text-sm flex items-start gap-2"
              >
                <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <span>{flash.success}</span>
              </motion.div>
            )}

            <form onSubmit={submit} className="space-y-4">
              <div className="space-y-4">
                {/* Username */}
                <div>
                  <input
                    type="text"
                    value={data.username}
                    className="w-full h-12 px-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-white/20"
                    placeholder="Nom d'utilisateur"
                    onChange={(e) => setData('username', e.target.value)}
                    autoComplete="username"
                  />
                  {errors.username && (
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="text-red-400 text-sm mt-2 text-left flex items-center gap-2"
                    >
                      <XCircle className="w-4 h-4" />
                      {errors.username}
                    </motion.div>
                  )}
                </div>

                {/* Email */}
                <div>
                  <input
                    type="email"
                    value={data.email}
                    className="w-full h-12 px-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-white/20"
                    placeholder="Email"
                    onChange={(e) => setData('email', e.target.value)}
                    autoComplete="email"
                  />
                  {errors.email && (
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="text-red-400 text-sm mt-2 text-left flex items-center gap-2"
                    >
                      <XCircle className="w-4 h-4" />
                      {errors.email}
                    </motion.div>
                  )}
                </div>

                {/* Password */}
                <div>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={data.password}
                      className="w-full h-12 px-4 pr-12 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-white/20"
                      placeholder="Mot de passe"
                      onChange={(e) => setData('password', e.target.value)}
                      autoComplete="new-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                      aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>

                  {/* Password Strength Indicator */}
                  <PasswordStrengthIndicator password={data.password} className="mt-3" />

                  {errors.password && (
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="text-red-400 text-sm mt-2 text-left flex items-center gap-2"
                    >
                      <XCircle className="w-4 h-4" />
                      {errors.password}
                    </motion.div>
                  )}
                </div>

                {/* Password Confirmation */}
                <div>
                  <div className="relative">
                    <input
                      type={showPasswordConfirmation ? 'text' : 'password'}
                      value={data.password_confirmation}
                      className="w-full h-12 px-4 pr-12 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-white/20"
                      placeholder="Confirmer le mot de passe"
                      onChange={(e) => setData('password_confirmation', e.target.value)}
                      autoComplete="new-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPasswordConfirmation(!showPasswordConfirmation)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                      aria-label={
                        showPasswordConfirmation
                          ? 'Masquer la confirmation'
                          : 'Afficher la confirmation'
                      }
                    >
                      {showPasswordConfirmation ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                  {errors.password_confirmation && (
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="text-red-400 text-sm mt-2 text-left flex items-center gap-2"
                    >
                      <XCircle className="w-4 h-4" />
                      {errors.password_confirmation}
                    </motion.div>
                  )}
                </div>
              </div>

              <button
                type="submit"
                className="w-full h-12 bg-white/10 hover:bg-white/20 text-white text-sm font-medium rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={processing}
              >
                {processing ? 'Inscription en cours...' : "S'inscrire"}
              </button>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-[#1a1f2d] px-2 text-white/40">Ou continuer avec</span>
              </div>
            </div>

            <button
              onClick={loginWithGithub}
              disabled={processing}
              className="w-full h-12 flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-white text-sm font-medium rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Github className="w-5 h-5" />
              <span>GitHub</span>
            </button>

            <div className="text-center">
              <Link
                href="/auth/login"
                className="text-sm text-white/60 hover:text-white transition-colors"
              >
                Déjà un compte ? <span className="font-medium">Se connecter</span>
              </Link>
            </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

Register.layout = (page: any) => <BaseLayout>{page}</BaseLayout>
