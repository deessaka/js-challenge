import { useForm, Link, usePage } from '@inertiajs/react'
import { Github, Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'

import AuthCard from '#components/auth/auth_card'
import FlashMessages from '#components/auth/flash_messages'
import BaseLayout from '#components/layouts/base_layout'
import { PasswordStrengthIndicator } from '~/components/auth/password_strength_indicator'

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

  function submit(event: React.FormEvent) {
    event.preventDefault()
    post('/auth/register')
  }

  const inputClass =
    'focus-ring h-12 w-full rounded-xl border border-foreground/15 bg-background px-4 text-sm outline-none transition-colors duration-150 placeholder:text-muted-foreground/70 focus:border-primary'

  return (
    <BaseLayout>
      <AuthCard
        title="Commencer à pratiquer"
        subtitle="Créez votre espace et avancez à votre rythme."
        maxContentHeight="90vh"
      >
        <FlashMessages error={flash?.error} success={flash?.success} />
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label htmlFor="register-username" className="mb-2 block text-sm font-semibold">
              Nom d’utilisateur
            </label>
            <input
              id="register-username"
              name="username"
              type="text"
              value={data.username}
              onChange={(event) => setData('username', event.target.value)}
              autoComplete="username"
              required
              className={inputClass}
              placeholder="votre_pseudo…"
            />
            {errors.username && (
              <p className="mt-2 text-xs text-destructive" role="alert">
                {errors.username}
              </p>
            )}
          </div>
          <div>
            <label htmlFor="register-email" className="mb-2 block text-sm font-semibold">
              Adresse email
            </label>
            <input
              id="register-email"
              name="email"
              type="email"
              value={data.email}
              onChange={(event) => setData('email', event.target.value)}
              autoComplete="email"
              required
              className={inputClass}
              placeholder="vous@exemple.com…"
            />
            {errors.email && (
              <p className="mt-2 text-xs text-destructive" role="alert">
                {errors.email}
              </p>
            )}
          </div>
          <div>
            <label htmlFor="register-password" className="mb-2 block text-sm font-semibold">
              Mot de passe
            </label>
            <div className="relative">
              <input
                id="register-password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={data.password}
                onChange={(event) => setData('password', event.target.value)}
                autoComplete="new-password"
                required
                className={`${inputClass} pr-12`}
                placeholder="8 caractères minimum…"
              />
              <button
                type="button"
                onClick={() => setShowPassword((visible) => !visible)}
                aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                className="focus-ring absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" aria-hidden="true" />
                ) : (
                  <Eye className="h-4 w-4" aria-hidden="true" />
                )}
              </button>
            </div>
            <PasswordStrengthIndicator password={data.password} className="mt-3" />
            {errors.password && (
              <p className="mt-2 text-xs text-destructive" role="alert">
                {errors.password}
              </p>
            )}
          </div>
          <div>
            <label
              htmlFor="register-password-confirmation"
              className="mb-2 block text-sm font-semibold"
            >
              Confirmer le mot de passe
            </label>
            <div className="relative">
              <input
                id="register-password-confirmation"
                name="password_confirmation"
                type={showPasswordConfirmation ? 'text' : 'password'}
                value={data.password_confirmation}
                onChange={(event) => setData('password_confirmation', event.target.value)}
                autoComplete="new-password"
                required
                className={`${inputClass} pr-12`}
                placeholder="Retapez votre mot de passe…"
              />
              <button
                type="button"
                onClick={() => setShowPasswordConfirmation((visible) => !visible)}
                aria-label={
                  showPasswordConfirmation ? 'Masquer la confirmation' : 'Afficher la confirmation'
                }
                className="focus-ring absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-muted-foreground hover:text-foreground"
              >
                {showPasswordConfirmation ? (
                  <EyeOff className="h-4 w-4" aria-hidden="true" />
                ) : (
                  <Eye className="h-4 w-4" aria-hidden="true" />
                )}
              </button>
            </div>
            {errors.password_confirmation && (
              <p className="mt-2 text-xs text-destructive" role="alert">
                {errors.password_confirmation}
              </p>
            )}
          </div>
          <button
            type="submit"
            disabled={processing}
            className="focus-ring mt-2 h-12 w-full rounded-full bg-foreground text-sm font-semibold text-background transition-transform duration-150 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {processing ? 'Création…' : 'Créer mon compte'}
          </button>
        </form>
        <div className="my-6 flex items-center gap-3 text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
          <span className="h-px flex-1 bg-foreground/10" /> ou{' '}
          <span className="h-px flex-1 bg-foreground/10" />
        </div>
        <button
          type="button"
          onClick={() => {
            window.location.href = '/oauth/github/redirect'
          }}
          disabled={processing}
          className="focus-ring inline-flex h-12 w-full items-center justify-center gap-2 rounded-full border border-foreground/15 text-sm font-semibold transition-colors duration-150 hover:bg-foreground/5 disabled:opacity-50"
        >
          <Github className="h-4 w-4" aria-hidden="true" /> Continuer avec GitHub
        </button>
        <p className="mt-7 text-center text-sm text-muted-foreground">
          Déjà un compte ?{' '}
          <Link
            href="/auth/login"
            className="focus-ring rounded font-semibold text-primary hover:underline"
          >
            Se connecter
          </Link>
        </p>
      </AuthCard>
    </BaseLayout>
  )
}
