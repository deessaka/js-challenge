import BaseLayout from '#components/layouts/base_layout'
import { useForm, Link, usePage } from '@inertiajs/react'
import { AnimatePresence } from 'framer-motion'
import { Github, XCircle, Eye, EyeOff } from 'lucide-react'
import { useState, useEffect } from 'react'
import AuthCard from '#components/auth/auth_card'
import FlashMessages from '#components/auth/flash_messages'
import { motion } from 'framer-motion'

export default function Login() {
  const { flash } = usePage().props as any
  const { data, setData, post, processing, errors } = useForm({
    email: '',
    password: '',
  })

  const [showPassword, setShowPassword] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  function submit(e: React.FormEvent) {
    e.preventDefault()
    post('/auth/login')
  }

  function loginWithGithub() {
    window.location.href = '/oauth/github/redirect'
  }

  return (
    <AnimatePresence>
      <AuthCard
        title="JS Challenge"
        subtitle="Connexion"
        isVisible={isVisible}
      >
        <FlashMessages
          error={flash?.error}
          success={flash?.success}
        />

        <form onSubmit={submit} className="space-y-6">
          <div className="space-y-4">
            {/* Email Field avec animation */}
            <div>
              <input
                type="email"
                value={data.email}
                className="w-full h-12 px-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all"
                placeholder="Email"
                onChange={(e) => setData('email', e.target.value)}
                autoComplete="email"
                autoFocus
                required
              />
              <AnimatePresence>
                {errors.email && (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className="text-red-400 text-sm mt-2 text-left flex items-center gap-2"
                  >
                    <XCircle className="w-4 h-4" />
                    {errors.email}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Password Field avec animation */}
            <div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={data.password}
                  className="w-full h-12 px-4 pr-12 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all"
                  placeholder="Mot de passe"
                  onChange={(e) => setData('password', e.target.value)}
                  autoComplete="current-password"
                  required
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
              <AnimatePresence>
                {errors.password && (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className="text-red-400 text-sm mt-2 text-left flex items-center gap-2"
                  >
                    <XCircle className="w-4 h-4" />
                    {errors.password}
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="mt-2 text-right"
              >
                <Link
                  href="/password/request-reset"
                  className="text-sm text-white/60 hover:text-white transition-colors"
                >
                  Mot de passe oublié ?
                </Link>
              </motion.div>
            </div>
          </div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <button
              type="submit"
              className="w-full h-12 bg-white/10 hover:bg-white/20 text-white text-sm font-medium rounded-xl transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              disabled={processing}
            >
              {processing ? 'Connexion...' : 'Se connecter'}
            </button>
          </motion.div>
        </form>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="relative"
        >
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/10"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-[#1a1f2d] px-2 text-white/40">Ou continuer avec</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <button
            onClick={loginWithGithub}
            disabled={processing}
            className="w-full h-12 flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-white text-sm font-medium rounded-xl transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            <Github className="w-5 h-5" />
            <span>GitHub</span>
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1 }}
          className="text-center"
        >
          <Link
            href="/auth/register"
            className="text-sm text-white/60 hover:text-white transition-colors"
          >
            Pas encore de compte ? <span className="font-medium">S'inscrire</span>
          </Link>
        </motion.div>
      </AuthCard>
    </AnimatePresence>
  )
}

Login.layout = (page: any) => <BaseLayout>{page}</BaseLayout>
