import { useForm, Link, usePage } from '@inertiajs/react'
import { Github, Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'

import AuthCard from '#components/auth/auth_card'
import FlashMessages from '#components/auth/flash_messages'
import BaseLayout from '#components/layouts/base_layout'

export default function Login() {
  const { flash } = usePage().props as any
  const { data, setData, post, processing, errors } = useForm({ email: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)

  function submit(event: React.FormEvent) {
    event.preventDefault()
    post('/auth/login')
  }

  return (
    <BaseLayout>
      <AuthCard
        title="Ravi de vous revoir"
        subtitle="Connectez-vous pour retrouver votre progression."
      >
        <FlashMessages error={flash?.error} success={flash?.success} />
        <form onSubmit={submit} className="space-y-5">
          <div>
            <label htmlFor="login-email" className="mb-2 block text-sm font-semibold">
              Adresse email
            </label>
            <input
              id="login-email"
              name="email"
              type="email"
              value={data.email}
              onChange={(event) => setData('email', event.target.value)}
              autoComplete="email"
              required
              className="focus-ring h-12 w-full rounded-xl border border-foreground/15 bg-background px-4 text-sm outline-none transition-colors duration-150 placeholder:text-muted-foreground/70 focus:border-primary"
              placeholder="vous@exemple.com…"
            />
            {errors.email && (
              <p className="mt-2 text-xs text-destructive" role="alert">
                {errors.email}
              </p>
            )}
          </div>
          <div>
            <div className="mb-2 flex items-center justify-between gap-3">
              <label htmlFor="login-password" className="block text-sm font-semibold">
                Mot de passe
              </label>
              <Link
                href="/password/request-reset"
                className="focus-ring rounded text-xs font-medium text-primary hover:underline"
              >
                Mot de passe oublié ?
              </Link>
            </div>
            <div className="relative">
              <input
                id="login-password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={data.password}
                onChange={(event) => setData('password', event.target.value)}
                autoComplete="current-password"
                required
                className="focus-ring h-12 w-full rounded-xl border border-foreground/15 bg-background px-4 pr-12 text-sm outline-none transition-colors duration-150 placeholder:text-muted-foreground/70 focus:border-primary"
                placeholder="Votre mot de passe…"
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
            {errors.password && (
              <p className="mt-2 text-xs text-destructive" role="alert">
                {errors.password}
              </p>
            )}
          </div>
          <button
            type="submit"
            disabled={processing}
            className="focus-ring h-12 w-full rounded-full bg-foreground text-sm font-semibold text-background transition-transform duration-150 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {processing ? 'Connexion…' : 'Se connecter'}
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
          Pas encore de compte ?{' '}
          <Link
            href="/auth/register"
            className="focus-ring rounded font-semibold text-primary hover:underline"
          >
            S’inscrire
          </Link>
        </p>
      </AuthCard>
    </BaseLayout>
  )
}
