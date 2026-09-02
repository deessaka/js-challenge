import { useForm, Link, usePage } from '@inertiajs/react'
import { Github, Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'

import { Button } from '#components/ui/button'
import { Input } from '#components/ui/input'
import { Label } from '#components/ui/label'
import FlashMessages from '#components/auth/flash_messages'
import AuthSplitLayout from '#components/layouts/auth_split_layout'

export default function Login() {
  const { flash } = usePage().props as any
  const { data, setData, post, processing, errors } = useForm({ email: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)

  function submit(event: React.FormEvent) {
    event.preventDefault()
    post('/auth/login')
  }

  return (
    <>
      <div>
        <h1 className="display-heading text-3xl uppercase">Ravi de vous revoir</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Connectez-vous pour retrouver votre progression.
        </p>
      </div>
      <div className="mt-8">
        <FlashMessages error={flash?.error} success={flash?.success} />
        <Button
          type="button"
          onClick={() => {
            window.location.href = '/oauth/github/redirect'
          }}
          disabled={processing}
          className="h-12 w-full rounded-full bg-foreground text-background hover:bg-foreground/90"
        >
          <Github className="h-4 w-4" aria-hidden="true" /> Continuer avec GitHub
        </Button>
        <div className="my-6 flex items-center gap-3 text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
          <span className="h-px flex-1 bg-foreground/10" /> ou{' '}
          <span className="h-px flex-1 bg-foreground/10" />
        </div>
        <p className="mb-4 text-center text-xs text-muted-foreground">
          Connexion par mot de passe réservée aux comptes administrateur. Les autres comptes
          doivent se connecter avec GitHub.
        </p>
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
            variant="outline"
            disabled={processing}
            className="h-12 w-full rounded-full"
          >
            {processing ? 'Connexion…' : 'Se connecter'}
          </Button>
        </form>
      </div>
    </>
  )
}

Login.layout = (page: React.ReactNode) => (
  <AuthSplitLayout
    seo={{
      title: 'Connexion',
      description: 'Connectez-vous à votre compte Codojo.',
    }}
  >
    {page}
  </AuthSplitLayout>
)
