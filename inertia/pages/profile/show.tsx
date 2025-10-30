import { Heading } from '#components/heading/heading'
import BaseLayout from '#components/layouts/base_layout'
import { Card, CardContent, CardHeader } from '#components/ui/Card'
import { SharedProps } from '@adonisjs/inertia/types'
import { usePage } from '@inertiajs/react'
import { Avatar, AvatarFallback, AvatarImage } from '#components/ui/components/ui/avatar'

interface ProfilePageProps extends SharedProps {
  user: any
  users: any[]
  [key: string]: any
}

function cn(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

export default function Show() {
  const { props } = usePage<ProfilePageProps>()
  const { user } = props
  console.log(user)
  return (
    <BaseLayout>
      <div className="max-w-6xl mx-auto">
        <Heading className="mb-6">Mon Profil</Heading>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-4">
                <Avatar className="h-20 w-20">
                  {user.avatar ? (
                    <AvatarImage src={user.avatar} alt={user.username} />
                  ) : (
                    <AvatarFallback className="bg-amber-200 text-amber-700 text-2xl font-semibold">
                      {user.username
                        .split(' ')
                        .map((n: string) => n[0])
                        .join('')
                        .toUpperCase()}
                    </AvatarFallback>
                  )}
                </Avatar>
                <div>
                  <h3 className="text-2xl font-semibold">{user.username}</h3>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Membre depuis</p>
                  <p>{new Date(user.createdAt).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Méthode de connexion</p>
                  <p className="capitalize">{user.oauthProviderName || 'Email'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Statut de l'email</p>
                  <div
                    className={cn(
                      'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold',
                      user.email_verified_at
                        ? 'bg-green-50 text-green-700'
                        : 'bg-yellow-50 text-yellow-700'
                    )}
                  >
                    {user.emailVerifiedAt ? 'Vérifié' : 'Non vérifié'}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold">Statistiques</h3>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Les statistiques seront bientôt disponibles...
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </BaseLayout>
  )
}
