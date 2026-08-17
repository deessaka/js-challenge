import { Link, useForm, usePage } from '@inertiajs/react'
import { CheckCircle2, Mail } from 'lucide-react'

import AuthCard from '#components/auth/auth_card'
import FlashMessages from '#components/auth/flash_messages'
import BaseLayout from '#components/layouts/base_layout'
import { Alert, AlertDescription, AlertTitle } from '#components/ui/alert'
import { Button } from '#components/ui/button'
import { Input } from '#components/ui/input'
import { Label } from '#components/ui/label'

export default function RequestPasswordReset() {
  const { flash } = usePage().props as any
  const { data, setData, post, processing, errors, wasSuccessful } = useForm({ email: '' })

  function submit(event: React.FormEvent) {
    event.preventDefault()
    post('/password/request-reset')
  }

  return (
    <AuthCard
      title="Mot de passe oublié"
      subtitle="Entrez votre adresse email et nous vous enverrons un lien pour réinitialiser votre mot de passe."
      maxContentHeight="90vh"
    >
      <FlashMessages error={flash?.error} success={flash?.success} />

      {wasSuccessful && !flash?.error ? (
        <div className="space-y-5">
          <Alert variant="success">
            <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
            <AlertTitle>Email envoyé</AlertTitle>
            <AlertDescription>
              <p>
                Si un compte existe avec cette adresse email, vous recevrez un lien de
                réinitialisation dans quelques instants.
              </p>
              <p className="mt-2 text-xs opacity-80">Vérifiez également votre dossier spam.</p>
            </AlertDescription>
          </Alert>
          <Button asChild variant="outline" className="w-full">
            <Link href="/auth/login">Retour à la connexion</Link>
          </Button>
        </div>
      ) : (
        <form onSubmit={submit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="email">Adresse email</Label>
            <div className="relative">
              <Mail
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden="true"
              />
              <Input
                id="email"
                type="email"
                value={data.email}
                className="pl-10"
                placeholder="vous@exemple.com"
                onChange={(event) => setData('email', event.target.value)}
                autoComplete="email"
                autoFocus
                aria-invalid={Boolean(errors.email)}
                aria-describedby={errors.email ? 'email-error' : undefined}
              />
            </div>
            {errors.email && (
              <p id="email-error" className="text-sm text-destructive">
                {errors.email}
              </p>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={processing}>
            {processing ? 'Envoi en cours…' : 'Envoyer le lien de réinitialisation'}
          </Button>
        </form>
      )}

      {!wasSuccessful && (
        <div className="mt-6 space-y-2 text-center text-sm text-muted-foreground">
          <Link href="/auth/login" className="block transition-colors hover:text-foreground">
            Retour à la connexion
          </Link>
          <Link href="/auth/register" className="block transition-colors hover:text-foreground">
            Pas encore de compte ? <span className="font-medium text-foreground">S’inscrire</span>
          </Link>
        </div>
      )}
    </AuthCard>
  )
}

RequestPasswordReset.layout = (page: React.ReactNode) => <BaseLayout>{page}</BaseLayout>
