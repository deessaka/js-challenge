import { SharedProps } from '@adonisjs/inertia/types'
import { useForm, usePage } from '@inertiajs/react'
import { Copy, KeyRound, ShieldCheck, Terminal, UserRound } from 'lucide-react'
import { useState } from 'react'

import DashboardLayout from '#components/layouts/dashboard_layout'
import { Alert, AlertDescription, AlertTitle } from '#components/ui/alert'
import { Avatar, AvatarFallback, AvatarImage } from '#components/ui/avatar'
import { Badge } from '#components/ui/badge'
import { Button } from '#components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '#components/ui/card'
import { Input } from '#components/ui/input'
import { Label } from '#components/ui/label'

interface ProfilePageProps extends SharedProps {
  user: any
  flash?: SharedProps['flash'] & { apiToken?: string | null }
  [key: string]: any
}

function getInitials(user: any) {
  return (user.name || user.username || user.email || '?')
    .split(' ')
    .filter(Boolean)
    .map((part: string) => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export default function Show() {
  const { props } = usePage<ProfilePageProps>()
  const { user, flash } = props
  const [copied, setCopied] = useState(false)
  const tokenForm = useForm({ name: 'Codojo CLI' })
  const apiToken = flash?.apiToken || null
  const displayName = user.name || user.username || user.email

  const copyToken = async () => {
    if (!apiToken || !navigator.clipboard) return
    await navigator.clipboard.writeText(apiToken)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 2000)
  }

  return (
    <DashboardLayout
      title="Profil & CLI"
      description="Gérez votre compte et connectez votre environnement de développement."
    >
      <div className="space-y-6">
        <section className="flex flex-col gap-5 rounded-[1.5rem] border border-border/70 bg-card/75 p-5 shadow-none sm:flex-row sm:items-center sm:justify-between sm:p-7">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16 border-2 border-background ring-4 ring-primary/10">
              <AvatarImage src={user.avatar} alt={displayName} />
              <AvatarFallback className="bg-primary/10 text-xl font-bold text-primary">
                {getInitials(user)}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="eyebrow text-[10px]">Compte Codojo</p>
              <h2 className="mt-1 text-2xl font-semibold tracking-[-0.04em]">{displayName}</h2>
              <p className="mt-1 text-sm text-muted-foreground">{user.email}</p>
            </div>
          </div>
          <Badge
            variant={user.emailVerifiedAt ? 'success' : 'destructive'}
            className="w-fit rounded-lg"
          >
            <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />{' '}
            {user.emailVerifiedAt ? 'Email vérifié' : 'Email à vérifier'}
          </Badge>
        </section>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
          <Card className="border-border/70 bg-card/75 shadow-none">
            <CardHeader className="border-b border-border/60 px-5 py-5 sm:px-6">
              <div className="flex items-center gap-2 text-xs font-medium text-primary">
                <UserRound className="h-4 w-4" aria-hidden="true" /> Informations du compte
              </div>
              <CardTitle className="mt-2 text-xl tracking-[-0.03em]">Votre espace Codojo</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 p-5 sm:grid-cols-2 sm:p-6">
              <div className="rounded-xl border border-border/60 bg-muted/30 p-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Membre depuis
                </p>
                <p className="mt-2 text-lg font-medium">
                  {new Date(user.createdAt).toLocaleDateString('fr-FR')}
                </p>
              </div>
              <div className="rounded-xl border border-border/60 bg-muted/30 p-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Authentification
                </p>
                <p className="mt-2 text-lg font-medium capitalize">
                  {user.oauthProviderName || 'Email'}
                </p>
              </div>
              <div className="rounded-xl border border-border/60 bg-muted/30 p-4 sm:col-span-2">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Rôle
                </p>
                <p className="mt-2 text-lg font-medium capitalize">{user.role || 'Utilisateur'}</p>
              </div>
            </CardContent>
          </Card>

          <Card id="api-token" className="border-primary/20 bg-primary/[0.04] shadow-none">
            <CardHeader className="px-5 pb-3 pt-5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                <Terminal className="h-5 w-5" aria-hidden="true" />
              </div>
              <CardTitle className="mt-4 text-xl tracking-[-0.03em]">Connecter le CLI</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 px-5 pb-5">
              <p className="text-sm leading-6 text-muted-foreground">
                Générez un token personnel pour utiliser Codojo depuis votre terminal. Le secret ne
                sera affiché qu’une seule fois.
              </p>
              <div className="rounded-xl border border-border/70 bg-background/70 px-3 py-2 font-mono text-xs">
                npm install --global @codojo/cli
              </div>
              <form
                className="space-y-3"
                onSubmit={(event) => {
                  event.preventDefault()
                  tokenForm.post('/profile/api-tokens', { preserveScroll: true })
                }}
              >
                <div className="space-y-2">
                  <Label htmlFor="token-name">Nom du token</Label>
                  <Input
                    id="token-name"
                    value={tokenForm.data.name}
                    onChange={(event) => tokenForm.setData('name', event.target.value)}
                    maxLength={80}
                  />
                </div>
                <Button type="submit" disabled={tokenForm.processing} className="w-full rounded-xl">
                  <KeyRound className="h-4 w-4" aria-hidden="true" />
                  {tokenForm.processing ? 'Génération…' : 'Générer un token'}
                </Button>
              </form>
              {apiToken && (
                <Alert variant="success">
                  <KeyRound className="h-4 w-4" aria-hidden="true" />
                  <AlertTitle>Token généré — copiez-le maintenant</AlertTitle>
                  <AlertDescription className="space-y-3">
                    <p>Ce secret ne sera plus affiché après cette page.</p>
                    <div className="flex gap-2">
                      <code className="min-w-0 flex-1 break-all rounded-lg border border-accent/20 bg-background/80 px-3 py-2 font-mono text-xs text-foreground">
                        {apiToken}
                      </code>
                      <Button type="button" variant="outline" size="sm" onClick={copyToken}>
                        {copied ? (
                          'Copié'
                        ) : (
                          <Copy className="h-4 w-4" aria-label="Copier le token" />
                        )}
                      </Button>
                    </div>
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
