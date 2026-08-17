import { usePage } from '@inertiajs/react'
import { SharedProps } from '@adonisjs/inertia/types'
import { Trophy } from 'lucide-react'

import BaseLayout from '#components/layouts/base_layout'
import PageHeader from '#components/page/page_header'
import EmptyState from '#components/page/empty_state'
import { Avatar, AvatarFallback, AvatarImage } from '#components/ui/avatar'
import { Badge } from '#components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '#components/ui/card'

interface ProfilePageProps extends SharedProps {
  user: any
  users: any[]
  [key: string]: any
}

export default function Show() {
  const { props } = usePage<ProfilePageProps>()
  const { user } = props
  const initials =
    user.username
      ?.split(' ')
      .map((name: string) => name[0])
      .join('')
      .toUpperCase() || '?'

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

        <div className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
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

          <Card>
            <CardHeader>
              <CardTitle>Statistiques</CardTitle>
            </CardHeader>
            <CardContent>
              <EmptyState
                icon={<Trophy className="h-5 w-5" aria-hidden="true" />}
                title="Bientôt disponible"
                description="Vos succès et statistiques détaillées arriveront ici."
                className="border-0 bg-transparent shadow-none"
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </BaseLayout>
  )
}
