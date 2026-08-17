import BaseLayout from '#components/layouts/base_layout'
import { useForm, Link, usePage } from '@inertiajs/react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft,
  Eye,
  EyeOff,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ShieldCheck,
} from 'lucide-react'
import { useState } from 'react'
import { PasswordStrengthIndicator } from '~/components/auth/password_strength_indicator'
import { Button } from '#components/ui/button'
import { Input } from '#components/ui/input'

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

interface ResetPasswordProps {
  token: string
}

export default function ResetPassword({ token }: ResetPasswordProps) {
  const { flash } = usePage().props as any
  const { data, setData, post, processing, errors, wasSuccessful } = useForm({
    password: '',
    password_confirmation: '',
  })

  const [showPassword, setShowPassword] = useState(false)
  const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false)

  function submit(e: React.FormEvent) {
    e.preventDefault()
    post(`/password/reset/${token}`)
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
                  <ShieldCheck className="w-8 h-8 text-white/60" />
                </div>
                <h1 className="text-2xl font-medium text-white">Nouveau mot de passe</h1>
                <p className="text-sm text-white/60 text-center max-w-xs">
                  Choisissez un nouveau mot de passe sécurisé pour votre compte.
                </p>
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

              {wasSuccessful && !flash?.error ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="space-y-4"
                >
                  <div className="p-6 bg-green-500/10 border border-green-500/20 rounded-xl text-center space-y-3">
                    <CheckCircle2 className="w-12 h-12 text-green-400 mx-auto" />
                    <h3 className="text-lg font-medium text-white">Mot de passe modifié !</h3>
                    <p className="text-sm text-white/80">
                      Votre mot de passe a été réinitialisé avec succès. Vous pouvez maintenant vous
                      connecter avec votre nouveau mot de passe.
                    </p>
                  </div>

                  <Link
                    href="/auth/login"
                    className="block w-full h-12 flex items-center justify-center bg-white/10 hover:bg-white/20 text-white text-sm font-medium rounded-xl transition-colors"
                  >
                    Se connecter
                  </Link>
                </motion.div>
              ) : (
                <form onSubmit={submit} className="space-y-4">
                  <div className="space-y-4">
                    {/* New Password */}
                    <div>
                      <div className="relative">
                        <Input
                          type={showPassword ? 'text' : 'password'}
                          value={data.password}
                          className="h-12 w-full rounded-xl border-white/10 bg-white/5 pr-12 text-white placeholder:text-gray-400 focus-visible:ring-white/20"
                          placeholder="Nouveau mot de passe"
                          onChange={(e) => setData('password', e.target.value)}
                          autoComplete="new-password"
                          autoFocus
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-2 top-1/2 h-8 w-8 -translate-y-1/2 text-gray-400 hover:bg-white/10 hover:text-white"
                          aria-label={
                            showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'
                          }
                        >
                          {showPassword ? (
                            <EyeOff className="w-5 h-5" />
                          ) : (
                            <Eye className="w-5 h-5" />
                          )}
                        </Button>
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
                        <Input
                          type={showPasswordConfirmation ? 'text' : 'password'}
                          value={data.password_confirmation}
                          className="h-12 w-full rounded-xl border-white/10 bg-white/5 pr-12 text-white placeholder:text-gray-400 focus-visible:ring-white/20"
                          placeholder="Confirmer le mot de passe"
                          onChange={(e) => setData('password_confirmation', e.target.value)}
                          autoComplete="new-password"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => setShowPasswordConfirmation(!showPasswordConfirmation)}
                          className="absolute right-2 top-1/2 h-8 w-8 -translate-y-1/2 text-gray-400 hover:bg-white/10 hover:text-white"
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
                        </Button>
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

                  <Button
                    type="submit"
                    variant="outline"
                    className="h-12 w-full rounded-xl border-white/15 bg-white/10 text-white hover:bg-white/20"
                    disabled={processing}
                  >
                    {processing ? 'Réinitialisation...' : 'Réinitialiser le mot de passe'}
                  </Button>
                </form>
              )}

              {!wasSuccessful && (
                <div className="text-center">
                  <Link
                    href="/auth/login"
                    className="text-sm text-white/60 hover:text-white transition-colors"
                  >
                    Retour à la connexion
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

ResetPassword.layout = (page: any) => <BaseLayout>{page}</BaseLayout>
