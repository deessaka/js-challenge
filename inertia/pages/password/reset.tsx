import { Link, useForm, usePage } from '@inertiajs/react'
import { CheckCircle2, Eye, EyeOff, ShieldCheck } from 'lucide-react'
import { useState } from 'react'

import AuthCard from '#components/auth/auth_card'
import FlashMessages from '#components/auth/flash_messages'
import { PasswordStrengthIndicator } from '#components/auth/password_strength_indicator'
import BaseLayout from '#components/layouts/base_layout'
import { Alert, AlertDescription, AlertTitle } from '#components/ui/alert'
import { Button } from '#components/ui/button'
import { Input } from '#components/ui/input'
import { Label } from '#components/ui/label'

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

  function submit(event: React.FormEvent) {
    event.preventDefault()
    post(`/password/reset/${token}`)
  }

  return (
    <AuthCard
      title="Nouveau mot de passe"
      subtitle="Choisissez un nouveau mot de passe sécurisé pour votre compte."
      maxContentHeight="90vh"
    >
      <FlashMessages error={flash?.error} success={flash?.success} />

      {wasSuccessful && !flash?.error ? (
        <div className="space-y-5">
          <Alert variant="success">
            <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
            <AlertTitle>Mot de passe modifié</AlertTitle>
            <AlertDescription>
              Votre mot de passe a été réinitialisé avec succès. Vous pouvez maintenant vous
              connecter.
            </AlertDescription>
          </Alert>
          <Button asChild className="w-full">
            <Link href="/auth/login">Se connecter</Link>
          </Button>
        </div>
      ) : (
        <form onSubmit={submit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="password">Nouveau mot de passe</Label>
            <div className="relative">
              <ShieldCheck
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden="true"
              />
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={data.password}
                className="pl-10 pr-10"
                placeholder="Votre nouveau mot de passe"
                onChange={(event) => setData('password', event.target.value)}
                autoComplete="new-password"
                autoFocus
                aria-invalid={Boolean(errors.password)}
                aria-describedby={errors.password ? 'password-error' : undefined}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => setShowPassword((visible) => !visible)}
                className="absolute right-1 top-1/2 h-8 w-8 -translate-y-1/2"
                aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
              >
                {showPassword ? <EyeOff aria-hidden="true" /> : <Eye aria-hidden="true" />}
              </Button>
            </div>
            <PasswordStrengthIndicator password={data.password} className="pt-1" />
            {errors.password && (
              <p id="password-error" className="text-sm text-destructive">
                {errors.password}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password_confirmation">Confirmer le mot de passe</Label>
            <div className="relative">
              <ShieldCheck
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden="true"
              />
              <Input
                id="password_confirmation"
                type={showPasswordConfirmation ? 'text' : 'password'}
                value={data.password_confirmation}
                className="pl-10 pr-10"
                placeholder="Confirmez votre mot de passe"
                onChange={(event) => setData('password_confirmation', event.target.value)}
                autoComplete="new-password"
                aria-invalid={Boolean(errors.password_confirmation)}
                aria-describedby={
                  errors.password_confirmation ? 'password-confirmation-error' : undefined
                }
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => setShowPasswordConfirmation((visible) => !visible)}
                className="absolute right-1 top-1/2 h-8 w-8 -translate-y-1/2"
                aria-label={
                  showPasswordConfirmation ? 'Masquer la confirmation' : 'Afficher la confirmation'
                }
              >
                {showPasswordConfirmation ? (
                  <EyeOff aria-hidden="true" />
                ) : (
                  <Eye aria-hidden="true" />
                )}
              </Button>
            </div>
            {errors.password_confirmation && (
              <p id="password-confirmation-error" className="text-sm text-destructive">
                {errors.password_confirmation}
              </p>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={processing}>
            {processing ? 'Réinitialisation…' : 'Réinitialiser le mot de passe'}
          </Button>
        </form>
      )}

      {!wasSuccessful && (
        <div className="mt-6 text-center text-sm text-muted-foreground">
          <Link href="/auth/login" className="transition-colors hover:text-foreground">
            Retour à la connexion
          </Link>
        </div>
      )}
    </AuthCard>
  )
}

ResetPassword.layout = (page: React.ReactNode) => <BaseLayout>{page}</BaseLayout>
