import BaseLayout from '#components/layouts/base_layout'
import AuthCard from '#components/auth/auth_card'
import FlashMessages from '#components/auth/flash_messages'
import { PasswordStrengthIndicator } from '~/components/auth/password_strength_indicator'
import { useEffect, useState } from 'react'
import { useForm, Link, usePage } from '@inertiajs/react'
import { motion, AnimatePresence } from 'framer-motion'
import { Github, Eye, EyeOff, XCircle } from 'lucide-react'

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
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  function submit(e: React.FormEvent) {
    e.preventDefault()
    post('/auth/register')
  }

  function loginWithGithub() {
    window.location.href = '/oauth/github/redirect'
  }

  return (
    <AnimatePresence mode="wait">
      <AuthCard
        title="JS Challenge"
        subtitle="Inscription"
        isVisible={isVisible}
        maxContentHeight="90vh"
      >
        <FlashMessages
          error={flash?.error}
          success={flash?.success}
        />

        <form onSubmit={submit} className="space-y-4">
          <div className="space-y-4">
            {/* Username */}
            <div>
              <input
                type="text"
                value={data.username}
                className="w-full h-12 px-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all"
                placeholder="Nom d'utilisateur"
                onChange={(e) => setData('username', e.target.value)}
                autoComplete="username"
                required
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
                className="w-full h-12 px-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all"
                placeholder="Email"
                onChange={(e) => setData('email', e.target.value)}
                autoComplete="email"
                required
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
                  className="w-full h-12 px-4 pr-12 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all"
                  placeholder="Mot de passe"
                  onChange={(e) => setData('password', e.target.value)}
                  autoComplete="new-password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

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
                  className="w-full h-12 px-4 pr-12 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all"
                  placeholder="Confirmer le mot de passe"
                  onChange={(e) => setData('password_confirmation', e.target.value)}
                  autoComplete="new-password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPasswordConfirmation(!showPasswordConfirmation)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
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
            className="w-full h-12 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-400 hover:to-indigo-500 text-white text-sm font-medium rounded-xl transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-[0_0_20px_rgba(168,85,247,0.4)] hover:shadow-[0_0_25px_rgba(168,85,247,0.6)] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            disabled={processing}
          >
            {processing ? 'Inscription...' : "S'inscrire"}
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
          className="w-full h-12 flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-white text-sm font-medium rounded-xl transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
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
      </AuthCard>
    </AnimatePresence>
  )
}

Register.layout = (page: any) => (
  <BaseLayout
    headerProps={{
      centerContent: (
        <h1 className="text-lg font-bold text-white tracking-tight">
          Inscription
        </h1>
      ),
      showNav: true
    }}
  >
    {page}
  </BaseLayout>
)
