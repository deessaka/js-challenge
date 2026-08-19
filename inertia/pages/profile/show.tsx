import { router, useForm, usePage } from '@inertiajs/react'
import { SharedProps } from '@adonisjs/inertia/types'
import { useState } from 'react'
import { Copy, KeyRound, Terminal, Trash2 } from 'lucide-react'

import BaseLayout from '#components/layouts/base_layout'
import PageHeader from '#components/page/page_header'
import { Alert, AlertDescription, AlertTitle } from '#components/ui/alert'
import { Avatar, AvatarFallback, AvatarImage } from '#components/ui/avatar'
import { Badge } from '#components/ui/badge'
import { Button } from '#components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '#components/ui/card'
import { Input } from '#components/ui/input'
import { Label } from '#components/ui/label'

interface ProfilePageProps extends SharedProps {
  user: any
  tokens: Array<{
    id: string
    name: string
    lastUsedAt: string | null
    expiresAt: string | null
    createdAt: string | null
  }>
  flash?: SharedProps['flash'] & { apiToken?: string | null }
  [key: string]: any
}

export default function Show() {
  const { props } = usePage<ProfilePageProps>()
  const { user, tokens = [], flash } = props
  const [copied, setCopied] = useState(false)
  const tokenForm = useForm({ name: 'Codojo CLI' })
  const apiToken = flash?.apiToken || null
  const initials =
    user.username
      ?.split(' ')
      .map((name: string) => name[0])
      .join('')
      .toUpperCase() || '?'

  const copyToken = async () => {
    if (!apiToken || !navigator.clipboard) return
    await navigator.clipboard.writeText(apiToken)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 2000)
  }

  return (
    <BaseLayout>
      <div className="space-y-10">
        <PageHeader
          eyebrow="Votre espace"
          title={user.username}
          description={user.email}
          leading={
            <Avatar className="h-16 w-16 shrink-0 border-2 border-background ring-4 ring-primary/10 sm:h-20 sm:w-20">
              {user.avatar ? (
                <AvatarImage src={user.avatar} alt={user.username} />
              ) : (
                <AvatarFallback className="bg-primary/10 text-2xl font-bold text-primary">
                  {initials}
                </AvatarFallback>
              )}
            </Avatar>
          }
        />

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Informations personnelles</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-xl border border-border/60 bg-muted/30 p-4">
                  <dt className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Membre depuis
                  </dt>
                  <dd className="mt-2 text-lg font-medium">
                    {new Date(user.createdAt).toLocaleDateString('fr-FR')}
                  </dd>
                </div>
                <div className="rounded-xl border border-border/60 bg-muted/30 p-4">
                  <dt className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Méthode d’authentification
                  </dt>
                  <dd className="mt-2 text-lg font-medium capitalize">
                    {user.oauthProviderName || 'Email'}
                  </dd>
                </div>
                <div className="flex items-center justify-between gap-4 rounded-xl border border-border/60 bg-muted/30 p-4 sm:col-span-2">
                  <div>
                    <dt className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Statut du compte
                    </dt>
                    <dd className="mt-2 text-lg font-medium">
                      Email {user.emailVerifiedAt ? 'vérifié' : 'non vérifié'}
                    </dd>
                  </div>
                  <Badge variant={user.emailVerifiedAt ? 'success' : 'destructive'}>
                    {user.emailVerifiedAt ? 'Actif' : 'En attente'}
                  </Badge>
                </div>
              </dl>
            </CardContent>
          </Card>

        </div>

        <Card id="api-token" className="border-primary/20 bg-primary/[0.02]">
          <CardHeader>
            <div className="flex items-start gap-3">
              <div className="rounded-xl bg-primary/10 p-2 text-primary">
                <Terminal className="h-5 w-5" aria-hidden="true" />
              </div>
              <div>
                <CardTitle>Utiliser Codojo dans le terminal</CardTitle>
                <p className="mt-2 text-sm text-muted-foreground">
                  Générez un token personnel pour connecter la commande <code>codojo</code> à votre
                  compte.
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="grid gap-3 rounded-xl border border-border/60 bg-background/80 p-4 text-sm text-muted-foreground md:grid-cols-4">
              <p>
                <strong className="text-foreground">1.</strong>{' '}
                <code>npm i -g @codojo/cli</code>
              </p>
              <p>
                <strong className="text-foreground">2.</strong> Générez un token ci-dessous.
              </p>
              <p>
                <strong className="text-foreground">3.</strong> Collez-le dans{' '}
                <code>codojo login</code>.
              </p>
              <p>
                <strong className="text-foreground">4.</strong> Lancez <code>codojo</code>.
              </p>
            </div>

            <form
              className="flex flex-col gap-4 sm:flex-row sm:items-end"
              onSubmit={(event) => {
                event.preventDefault()
                tokenForm.post('/profile/api-tokens', { preserveScroll: true })
              }}
            >
              <div className="flex-1 space-y-2">
                <Label htmlFor="token-name">Nom du token</Label>
                <Input
                  id="token-name"
                  value={tokenForm.data.name}
                  onChange={(event) => tokenForm.setData('name', event.target.value)}
                  maxLength={80}
                />
              </div>
              <Button type="submit" disabled={tokenForm.processing}>
                <KeyRound className="h-4 w-4" aria-hidden="true" />
                {tokenForm.processing ? 'Génération…' : 'Générer un token'}
              </Button>
            </form>

            {apiToken && (
              <Alert variant="success">
                <KeyRound className="h-4 w-4" aria-hidden="true" />
                <AlertTitle>Token généré — copiez-le maintenant</AlertTitle>
                <AlertDescription className="space-y-3">
                  <p>Pour votre sécurité, ce secret ne sera plus affiché après cette page.</p>
                  <div className="flex flex-col gap-2 sm:flex-row">
                    <code className="min-w-0 flex-1 break-all rounded-lg border border-accent/20 bg-background/80 px-3 py-2 font-mono text-xs text-foreground">
                      {apiToken}
                    </code>
                    <Button type="button" variant="outline" size="sm" onClick={copyToken}>
                      <Copy className="h-4 w-4" aria-hidden="true" />
                      {copied ? 'Copié' : 'Copier'}
                    </Button>
                  </div>
                </AlertDescription>
              </Alert>
            )}

            <div className="border-t border-border/60 pt-5">
              <h3 className="font-semibold">Tokens actifs</h3>
              {tokens.length === 0 ? (
                <p className="mt-3 text-sm text-muted-foreground">Aucun token CLI actif.</p>
              ) : (
                <ul className="mt-3 divide-y divide-border/60 rounded-xl border border-border/60">
                  {tokens.map((token) => (
                    <li key={token.id} className="flex items-center justify-between gap-4 p-4">
                      <div>
                        <p className="font-medium">{token.name}</p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          Créé le {token.createdAt ? new Date(token.createdAt).toLocaleDateString('fr-FR') : '—'}
                          {' · '}Dernière utilisation {token.lastUsedAt ? new Date(token.lastUsedAt).toLocaleDateString('fr-FR') : 'jamais'}
                        </p>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => router.delete(`/profile/api-tokens/${token.id}`, { preserveScroll: true })}
                      >
                        <Trash2 className="h-4 w-4" aria-hidden="true" /> Révoquer
                      </Button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </BaseLayout>
  )
}
