import { useForm, Link, usePage } from '@inertiajs/react'
import { Github, Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'

import AuthCard from '#components/auth/auth_card'
import { Button } from '#components/ui/button'
import { Input } from '#components/ui/input'
import { Label } from '#components/ui/label'
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
            <Label htmlFor="login-email" className="mb-2 block text-sm font-semibold">
              Adresse email
            </Label>
            <Input
              id="login-email"
              name="email"
              type="email"
              value={data.email}
              onChange={(event) => setData('email', event.target.value)}
              autoComplete="email"
              required
              className="h-12 rounded-xl"
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
              <Label htmlFor="login-password" className="block text-sm font-semibold">
                Mot de passe
              </Label>
              <Link
                href="/password/request-reset"
                className="focus-ring rounded text-xs font-medium text-primary hover:underline"
              >
                Mot de passe oublié ?
              </Link>
            </div>
            <div className="relative">
              <Input
                id="login-password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={data.password}
                onChange={(event) => setData('password', event.target.value)}
                autoComplete="current-password"
                required
                className="h-12 rounded-xl pr-12"
                placeholder="Votre mot de passe…"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => setShowPassword((visible) => !visible)}
                aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                className="absolute right-2 top-1/2 h-8 w-8 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" aria-hidden="true" />
                ) : (
                  <Eye className="h-4 w-4" aria-hidden="true" />
                )}
              </Button>
            </div>
            {errors.password && (
              <p className="mt-2 text-xs text-destructive" role="alert">
                {errors.password}
              </p>
            )}
          </div>
          <Button
            type="submit"
            disabled={processing}
            className="h-12 w-full rounded-full bg-foreground text-background hover:bg-foreground/90"
          >
            {processing ? 'Connexion…' : 'Se connecter'}
          </Button>
        </form>
        <div className="my-6 flex items-center gap-3 text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
          <span className="h-px flex-1 bg-foreground/10" /> ou{' '}
          <span className="h-px flex-1 bg-foreground/10" />
        </div>
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            window.location.href = '/oauth/github/redirect'
          }}
          disabled={processing}
          className="h-12 w-full rounded-full"
        >
          <Github className="h-4 w-4" aria-hidden="true" /> Continuer avec GitHub
        </Button>
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
