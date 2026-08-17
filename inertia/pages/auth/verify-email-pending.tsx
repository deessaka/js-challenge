import { Link, useForm, usePage } from '@inertiajs/react'
import { AlertTriangle, Clock, Loader2, Mail } from 'lucide-react'
import { useEffect, useState } from 'react'

import AuthCard from '#components/auth/auth_card'
import FlashMessages from '#components/auth/flash_messages'
import BaseLayout from '#components/layouts/base_layout'
import { Alert, AlertDescription, AlertTitle } from '#components/ui/alert'
import { Button } from '#components/ui/button'

interface VerifyEmailPendingProps {
  email: string
  flash?: { success?: string; error?: string }
}

export default function VerifyEmailPending() {
  const { email, flash } = usePage().props as VerifyEmailPendingProps
  const { post, processing } = useForm({ email })
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
      title="Vérifiez votre email"
      subtitle={`Nous avons envoyé un email de vérification à ${email}.`}
    >
      <div className="space-y-5">
        <p className="text-center text-sm leading-6 text-muted-foreground">
          Consultez votre boîte de réception et cliquez sur le lien de vérification pour activer
          votre compte.
        </p>

        <Alert variant="warning">
          <AlertTriangle className="h-4 w-4" aria-hidden="true" />
          <AlertTitle>Attention</AlertTitle>
          <AlertDescription>Le lien de vérification expirera dans 24 heures.</AlertDescription>
        </Alert>

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
            ) : (
              'Je n’ai pas reçu l’email'
            )}
          </Button>
        </form>

        <div className="border-t border-border/70 pt-5 text-center text-sm text-muted-foreground">
          <Link href="/auth/login" className="block transition-colors hover:text-foreground">
            Retour à la connexion
          </Link>
          <Link
            href="/auth/register"
            className="mt-3 block transition-colors hover:text-foreground"
          >
            S’inscrire avec un autre email
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
