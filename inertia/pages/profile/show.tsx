import { Heading } from '#components/heading/heading'
import BaseLayout from '#components/layouts/base_layout'
import { Card, CardContent, CardHeader } from '#components/ui/card'
import { SharedProps } from '@adonisjs/inertia/types'
import { usePage } from '@inertiajs/react'
import { Avatar, AvatarFallback, AvatarImage } from '#components/ui/avatar'
import { Trophy } from 'lucide-react'

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

  return (
    <BaseLayout>
      <div className="max-w-5xl mx-auto space-y-8 py-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border/50 pb-8">
          <div className="flex items-center space-x-6">
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-tr from-accent-light to-primary rounded-full blur opacity-20" />
              <Avatar className="h-24 w-24 border-2 border-background ring-4 ring-border/10">
                {user.avatar ? (
                  <AvatarImage src={user.avatar} alt={user.username} />
                ) : (
                  <AvatarFallback className="bg-primary/10 text-primary font-bold text-3xl">
                    {user.username
                      ?.split(' ')
                      .map((n: string) => n[0])
                      .join('')
                      .toUpperCase() ?? '?'}
                  </AvatarFallback>
                )}
              </Avatar>
            </div>
            <div className="space-y-1">
              <Heading className="mb-0 leading-none">{user.username}</Heading>
              <p className="text-muted-foreground text-lg">{user.email}</p>
            </div>
          </div>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          <Card className="md:col-span-2 bg-card/50 backdrop-blur-sm border-border/50">
            <CardHeader className="pb-2">
              <h3 className="text-xl font-bold text-foreground">Informations personnelles</h3>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 sm:grid-cols-2 mt-4">
                <div className="space-y-1.5 p-4 rounded-xl bg-muted/30 border border-border/30">
                  <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground/70">Membre depuis</p>
                  <p className="text-lg font-medium">{new Date(user.createdAt).toLocaleDateString()}</p>
                </div>

                <div className="space-y-1.5 p-4 rounded-xl bg-muted/30 border border-border/30">
                  <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground/70">Méthode d'auth</p>
                  <p className="text-lg font-medium capitalize">{user.oauthProviderName || 'Email'}</p>
                </div>

                <div className="sm:col-span-2 space-y-1.5 p-4 rounded-xl bg-muted/30 border border-border/30 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground/70">Statut du compte</p>
                    <p className="text-lg font-medium">Email {user.emailVerifiedAt ? 'Vérifié' : 'Non vérifié'}</p>
                  </div>
                  <div
                    className={cn(
                      'inline-flex items-center rounded-lg px-3 py-1 text-xs font-bold ring-1 ring-inset',
                      user.emailVerifiedAt
                        ? 'bg-accent/10 text-accent-light ring-accent/20'
                        : 'bg-destructive/10 text-destructive ring-destructive/20'
                    )}
                  >
                    {user.emailVerifiedAt ? 'Actif' : 'En attente'}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur-sm border-border/50">
            <CardHeader className="pb-2">
              <h3 className="text-xl font-bold text-foreground">Statistiques</h3>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
                <div className="p-4 rounded-full bg-muted/50">
                  <Trophy className="w-8 h-8 text-muted-foreground/30" />
                </div>
                <p className="text-sm text-muted-foreground max-w-[200px]">
                  Vos succès et statistiques détaillées arrivent très bientôt !
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </BaseLayout>
  )
}
