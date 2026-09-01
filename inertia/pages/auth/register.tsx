import { useForm, Link, usePage } from '@inertiajs/react'
import { Github, Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'

import { Button } from '#components/ui/button'
import { Input } from '#components/ui/input'
import { Label } from '#components/ui/label'
import FlashMessages from '#components/auth/flash_messages'
import AuthSplitLayout from '#components/layouts/auth_split_layout'
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

  return (
    <>
      <div>
        <h1 className="display-heading text-3xl uppercase">Commencer à pratiquer</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Créez votre espace et avancez à votre rythme.
        </p>
      </div>
      <div className="mt-8">
        <FlashMessages error={flash?.error} success={flash?.success} />
        <form onSubmit={submit} className="space-y-4">
          <div>
            <Label htmlFor="register-username" className="mb-2 block text-sm font-semibold">
              Nom d’utilisateur
            </Label>
            <Input
              id="register-username"
              name="username"
              type="text"
              value={data.username}
              onChange={(event) => setData('username', event.target.value)}
              autoComplete="username"
              required
              className="h-12 rounded-xl"
              placeholder="votre_pseudo…"
            />
            {errors.username && (
              <p className="mt-2 text-xs text-destructive" role="alert">
                {errors.username}
              </p>
            )}
          </div>
          <div>
            <Label htmlFor="register-email" className="mb-2 block text-sm font-semibold">
              Adresse email
            </Label>
            <Input
              id="register-email"
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
            <Label htmlFor="register-password" className="mb-2 block text-sm font-semibold">
              Mot de passe
            </Label>
            <div className="relative">
              <Input
                id="register-password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={data.password}
                onChange={(event) => setData('password', event.target.value)}
                autoComplete="new-password"
                required
                className="h-12 rounded-xl pr-12"
                placeholder="8 caractères minimum…"
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
            <PasswordStrengthIndicator password={data.password} className="mt-3" />
            {errors.password && (
              <p className="mt-2 text-xs text-destructive" role="alert">
                {errors.password}
              </p>
            )}
          </div>
          <div>
            <Label
              htmlFor="register-password-confirmation"
              className="mb-2 block text-sm font-semibold"
            >
              Confirmer le mot de passe
            </Label>
            <div className="relative">
              <Input
                id="register-password-confirmation"
                name="password_confirmation"
                type={showPasswordConfirmation ? 'text' : 'password'}
                value={data.password_confirmation}
                onChange={(event) => setData('password_confirmation', event.target.value)}
                autoComplete="new-password"
                required
                className="h-12 rounded-xl pr-12"
                placeholder="Retapez votre mot de passe…"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => setShowPasswordConfirmation((visible) => !visible)}
                aria-label={
                  showPasswordConfirmation ? 'Masquer la confirmation' : 'Afficher la confirmation'
                }
                className="absolute right-2 top-1/2 h-8 w-8 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPasswordConfirmation ? (
                  <EyeOff className="h-4 w-4" aria-hidden="true" />
                ) : (
                  <Eye className="h-4 w-4" aria-hidden="true" />
                )}
              </Button>
            </div>
            {errors.password_confirmation && (
              <p className="mt-2 text-xs text-destructive" role="alert">
                {errors.password_confirmation}
              </p>
            )}
          </div>
          <Button
            type="submit"
            disabled={processing}
            className="mt-2 h-12 w-full rounded-full bg-foreground text-background hover:bg-foreground/90"
          >
            {processing ? 'Création…' : 'Créer mon compte'}
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
          Déjà un compte ?{' '}
          <Link
            href="/auth/login"
            className="focus-ring rounded font-semibold text-primary hover:underline"
          >
            Se connecter
          </Link>
        </p>
      </div>
    </>
  )
}

Register.layout = (page: React.ReactNode) => (
  <AuthSplitLayout
    seo={{
      title: 'Inscription',
      description: 'Créez votre compte Codojo pour commencer les katas JavaScript.',
    }}
  >
    {page}
  </AuthSplitLayout>
)
