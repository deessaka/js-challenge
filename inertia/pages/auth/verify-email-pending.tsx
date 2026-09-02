import { Link, useForm, usePage } from '@inertiajs/react'
import { AlertTriangle, Clock, Loader2, Mail } from 'lucide-react'
import { useEffect, useState } from 'react'

import AuthCard from '#components/auth/auth_card'
import FlashMessages from '#components/auth/flash_messages'
import BaseLayout from '#components/layouts/base_layout'
import { Alert, AlertDescription, AlertTitle } from '#components/ui/alert'
import { Button } from '#components/ui/button'
import { Input } from '#components/ui/input'
import { Label } from '#components/ui/label'

interface VerifyEmailPendingProps {
  email: string
  /** Whether a verification email was just dispatched for this visit, vs. just offering to send one. */
  justSent?: boolean
  flash?: { success?: string; error?: string }
}

export default function VerifyEmailPending() {
  const {
    email: initialEmail,
    justSent = true,
    flash,
  } = usePage().props as VerifyEmailPendingProps
  const knowsEmail = initialEmail !== ''
  const { data, setData, post, processing, errors } = useForm({ email: initialEmail })
  const [countdown, setCountdown] = useState(0)
  const [resendDisabled, setResendDisabled] = useState(false)
  const [localSuccess, setLocalSuccess] = useState<string | null>(null)
  const [localError, setLocalError] = useState<string | null>(null)

  useEffect(() => {
    if (countdown <= 0) {
      if (resendDisabled) setResendDisabled(false)
      return
    }

    const timer = window.setTimeout(() => setCountdown((value) => value - 1), 1000)
    return () => window.clearTimeout(timer)
  }, [countdown, resendDisabled])

  function handleResend(event: React.FormEvent) {
    event.preventDefault()
    setResendDisabled(true)
    setCountdown(60)
    setLocalSuccess(null)
    setLocalError(null)

    post('/auth/resend-verification', {
      preserveScroll: true,
      onSuccess: () => {
        setLocalSuccess(
          'Email de vérification renvoyé avec succès. Vérifiez votre boîte de réception.'
        )
      },
      onError: (errors) => {
        setLocalError(errors.email || 'Une erreur est survenue lors du renvoi de l’email.')
        setResendDisabled(false)
        setCountdown(0)
      },
    })
  }

  return (
    <AuthCard
      icon={<Mail className="h-5 w-5" aria-hidden="true" />}
      title={knowsEmail ? 'Vérifiez votre email' : 'Renvoyer l’email de vérification'}
      subtitle={
        knowsEmail
          ? justSent
            ? `Nous avons envoyé un email de vérification à ${initialEmail}.`
            : `Un compte existe pour ${initialEmail}, mais n’est pas encore vérifié.`
          : 'Indiquez votre adresse email pour recevoir un nouveau lien de vérification.'
      }
    >
      <div className="space-y-5">
        {knowsEmail && justSent && (
          <p className="text-center text-sm leading-6 text-muted-foreground">
            Consultez votre boîte de réception et cliquez sur le lien de vérification pour activer
            votre compte.
          </p>
        )}
        {knowsEmail && !justSent && (
          <p className="text-center text-sm leading-6 text-muted-foreground">
            Cliquez sur le bouton ci-dessous pour recevoir un nouveau lien de vérification.
          </p>
        )}
        {!knowsEmail && (
          <div>
            <Label htmlFor="resend-email" className="mb-2 block text-sm font-semibold">
              Adresse email
            </Label>
            <Input
              id="resend-email"
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
        )}

        {knowsEmail && (
          <Alert variant="warning">
            <AlertTriangle className="h-4 w-4" aria-hidden="true" />
            <AlertTitle>Attention</AlertTitle>
            <AlertDescription>Le lien de vérification expirera dans 24 heures.</AlertDescription>
          </Alert>
        )}

        <FlashMessages
          success={flash?.success || localSuccess || undefined}
          error={flash?.error || localError || undefined}
        />

        <form onSubmit={handleResend}>
          <Button
            type="submit"
            variant="outline"
            className="w-full"
            disabled={processing || resendDisabled}
          >
            {processing ? (
              <>
                <Loader2 className="animate-spin" aria-hidden="true" /> Envoi en cours…
              </>
            ) : countdown > 0 ? (
              <>
                <Clock aria-hidden="true" /> Renvoyer dans {countdown}s
              </>
            ) : knowsEmail ? (
              justSent ? (
                'Je n’ai pas reçu l’email'
              ) : (
                'Recevoir le lien de vérification'
              )
            ) : (
              'Envoyer le lien de vérification'
            )}
          </Button>
        </form>

        <div className="border-t border-border/70 pt-5 text-center text-sm text-muted-foreground">
          <Link href="/auth/login" className="block transition-colors hover:text-foreground">
            Retour à la connexion
          </Link>
          <p className="mt-5 text-xs leading-5">
            Vous ne trouvez pas l’email ? Vérifiez votre dossier spam ou courrier indésirable.
          </p>
        </div>
      </div>
    </AuthCard>
  )
}

VerifyEmailPending.layout = (page: React.ReactNode) => <BaseLayout>{page}</BaseLayout>
