import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'
import { access } from 'node:fs/promises'
import { join } from 'node:path'
import { DateTime } from 'luxon'
import AdminActivityLog from '#models/admin_activity_log'
import Exercise from '#models/exercise'
import User from '#models/user'
import UserProgress from '#models/user_progress'
import UserSolution from '#models/user_solution'
import UserProgressService from '#services/user_progress'
import TokenAuthAccessToken from '#models/token'
import db from '@adonisjs/lucid/services/db'

const roles = ['user', 'admin', 'super_admin'] as const
const userStatuses = ['active', 'suspended'] as const
const exerciseStatuses = ['draft', 'published', 'archived'] as const

type UserRole = (typeof roles)[number]
type UserStatus = (typeof userStatuses)[number]
type ExerciseStatus = (typeof exerciseStatuses)[number]

function asPage(value: unknown) {
  const page = Number(value)
  return Number.isFinite(page) && page > 0 ? page : 1
}

function asPositiveNumber(value: unknown, fallback: number) {
  const parsed = Number(value)
  return Number.isFinite(parsed) && parsed > 0 ? Math.round(parsed) : fallback
}

function slugify(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

@inject()
export default class AdminController {
  constructor(private userProgressService: UserProgressService) {}

  private async validatePrerequisite(
    exerciseId: number | null,
    prerequisiteId: number | null,
    nextStatus: ExerciseStatus
  ): Promise<string | null> {
    if (!prerequisiteId) return null
    if (exerciseId === prerequisiteId) return 'Un exercice ne peut pas être son propre prérequis.'

    const prerequisite = await Exercise.find(prerequisiteId)
    if (!prerequisite) return 'Le prérequis sélectionné est introuvable.'
    if (nextStatus === 'published' && prerequisite.status !== 'published') {
      return 'Le prérequis doit être publié avant cet exercice.'
    }

    const visited = new Set<number>()
    let cursor = prerequisite
    while (cursor.prerequisiteId) {
      const cursorId = Number(cursor.prerequisiteId)
      if (cursorId === exerciseId || visited.has(cursorId)) {
        return 'Ce prérequis créerait une dépendance cyclique.'
      }
      visited.add(cursorId)
      const next = await Exercise.find(cursorId)
      if (!next) break
      cursor = next
    }
    return null
  }

  private async log(
    actorId: string,
    action: string,
    entityType: string,
    entityId: string,
    reason?: string
  ) {
    await AdminActivityLog.create({
      actorId,
      action,
      entityType,
      entityId,
      reason: reason || null,
    })
  }

  private serializeUser(user: User) {
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      avatar: user.avatar,
      role: user.role,
      status: user.status,
      totalPoints: user.totalPoints ?? 0,
      emailVerifiedAt: user.emailVerifiedAt,
      suspendedAt: user.suspendedAt,
      suspensionReason: user.suspensionReason,
      createdAt: user.createdAt,
    }
  }

  private serializeExercise(exercise: Exercise) {
    return {
      id: exercise.id,
      number: exercise.number,
      title: exercise.title,
      description: exercise.description,
      difficulty: exercise.difficulty,
      slug: exercise.slug || `exercise-${exercise.number}`,
      category: exercise.category || 'JavaScript',
      points: exercise.points ?? 10,
      status: exercise.status || 'published',
      starterCode: exercise.starterCode || '',
      hint: exercise.hint || '',
      prerequisiteId: exercise.prerequisiteId || null,
      createdAt: exercise.createdAt,
      updatedAt: exercise.updatedAt,
    }
  }

  async dashboard({ inertia }: HttpContext) {
    const [
      activeUsers,
      suspendedUsers,
      newUsers,
      publishedExercises,
      draftExercises,
      archivedExercises,
      recentLogs,
    ] = await Promise.all([
      User.query().where('status', 'active').count('* as total'),
      User.query().where('status', 'suspended').count('* as total'),
      User.query()
        .where('created_at', '>=', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000))
        .count('* as total'),
      Exercise.query().where('status', 'published').count('* as total'),
      Exercise.query().where('status', 'draft').count('* as total'),
      Exercise.query().where('status', 'archived').count('* as total'),
      AdminActivityLog.query().preload('actor').orderBy('created_at', 'desc').limit(8),
    ])

    return inertia.render('admin/dashboard', {
      stats: {
        activeUsers: Number(activeUsers[0].$extras.total || 0),
        suspendedUsers: Number(suspendedUsers[0].$extras.total || 0),
        newUsers: Number(newUsers[0].$extras.total || 0),
        publishedExercises: Number(publishedExercises[0].$extras.total || 0),
        draftExercises: Number(draftExercises[0].$extras.total || 0),
        archivedExercises: Number(archivedExercises[0].$extras.total || 0),
      },
      recentLogs: recentLogs.map((log) => ({
        id: log.id,
        action: log.action,
        entityType: log.entityType,
        entityId: log.entityId,
        reason: log.reason,
        actor: log.actor?.username || 'Administrateur',
        createdAt: log.createdAt,
      })),
    })
  }

  async users({ inertia, request }: HttpContext) {
    const page = asPage(request.input('page'))
    const search = String(request.input('search', '')).trim()
    const status = String(request.input('status', 'all'))
    const role = String(request.input('role', 'all'))

    const query = User.query().orderBy('created_at', 'desc')
    if (search) {
      query.where((builder) => {
        builder.where('username', 'like', `%${search}%`).orWhere('email', 'like', `%${search}%`)
      })
    }
    if (userStatuses.includes(status as UserStatus)) query.where('status', status)
    if (roles.includes(role as UserRole)) query.where('role', role)

    const users = await query.paginate(page, 20)
    const serializedUsers = await Promise.all(
      users.all().map(async (user) => ({
        ...this.serializeUser(user),
        totalPoints: (await this.userProgressService.getUserStats(user)).totalPoints,
      }))
    )
    return inertia.render('admin/users', {
      users: { ...users.toJSON(), data: serializedUsers },
      filters: { search, status, role },
    })
  }

  async updateUser({ params, request, response, auth, session }: HttpContext) {
    const actor = auth.user!
    const user = await User.findOrFail(params.id)
    const role = String(request.input('role', user.role)) as UserRole

    if (!roles.includes(role)) {
      session.flash('error', 'Rôle utilisateur invalide.')
      return response.redirect().back()
    }
    if (role === 'super_admin' && actor.role !== 'super_admin') {
      session.flash('error', 'Seul un super administrateur peut attribuer ce rôle.')
      return response.redirect().back()
    }
    if (user.id === actor.id && role !== 'super_admin') {
      session.flash('error', 'Vous ne pouvez pas réduire vos propres permissions.')
      return response.redirect().back()
    }

    user.role = role
    await user.save()
    await this.log(actor.id, 'user.role_changed', 'user', user.id, `Nouveau rôle : ${role}`)
    session.flash('success', 'Le rôle utilisateur a été mis à jour.')
    return response.redirect().back()
  }

  async updateUserStatus({ params, request, response, auth, session }: HttpContext) {
    const actor = auth.user!
    const user = await User.findOrFail(params.id)
    const status = String(request.input('status', 'active')) as UserStatus
    const reason = String(request.input('reason', '')).trim()

    if (!userStatuses.includes(status) || (status === 'suspended' && !reason)) {
      session.flash('error', 'Un statut valide et une raison sont requis pour cette action.')
      return response.redirect().back()
    }
    if (user.id === actor.id) {
      session.flash('error', 'Vous ne pouvez pas suspendre votre propre compte.')
      return response.redirect().back()
    }

    await db.transaction(async (trx) => {
      user.useTransaction(trx)
      user.status = status
      user.suspendedAt = status === 'suspended' ? DateTime.now() : null
      user.suspendedBy = status === 'suspended' ? actor.id : null
      user.suspensionReason = status === 'suspended' ? reason : null
      await user.save()
      if (status === 'suspended') {
        await TokenAuthAccessToken.query({ client: trx })
          .where('tokenable_id', user.id)
          .whereIn('type', ['auth_token', 'remember_me_token'])
          .delete()
      }
    })
    await this.log(actor.id, `user.${status}`, 'user', user.id, reason || undefined)
    session.flash(
      'success',
      status === 'suspended' ? 'Utilisateur suspendu.' : 'Utilisateur réactivé.'
    )
    return response.redirect().back()
  }

  async resetUserProgress({ params, request, response, auth, session }: HttpContext) {
    const actor = auth.user!
    if (actor.role !== 'super_admin') {
      session.flash('error', 'Seul un super administrateur peut réinitialiser une progression.')
      return response.redirect().back()
    }

    const user = await User.findOrFail(params.id)
    const reason = String(request.input('reason', '')).trim()

    if (!reason) {
      session.flash('error', 'Une raison est obligatoire pour réinitialiser une progression.')
      return response.redirect().back()
    }

    await UserProgress.query().where('user_id', user.id).delete()
    await UserSolution.query().where('user_id', user.id).delete()
    await this.log(actor.id, 'user.progress_reset', 'user', user.id, reason)
    session.flash('success', 'La progression et les solutions enregistrées ont été réinitialisées.')
    return response.redirect().back()
  }

  async exercises({ inertia, request }: HttpContext) {
    const page = asPage(request.input('page'))
    const search = String(request.input('search', '')).trim()
    const status = String(request.input('status', 'all'))

    const query = Exercise.query().orderBy('number', 'asc')
    if (search) {
      query.where((builder) => {
        builder.where('title', 'like', `%${search}%`).orWhere('category', 'like', `%${search}%`)
      })
    }
    if (exerciseStatuses.includes(status as ExerciseStatus)) query.where('status', status)

    const exercises = await query.paginate(page, 20)
    return inertia.render('admin/exercises', {
      exercises: {
        ...exercises.toJSON(),
        data: exercises.all().map((exercise) => this.serializeExercise(exercise)),
      },
      filters: { search, status },
    })
  }

  async createExercise({ request, response, auth, session }: HttpContext) {
    const title = String(request.input('title', '')).trim()
    const description = String(request.input('description', '')).trim()
    const status = String(request.input('status', 'draft')) as ExerciseStatus

    if (!title || !description || !exerciseStatuses.includes(status)) {
      session.flash('error', 'Titre, description et statut sont obligatoires.')
      return response.redirect().back()
    }

    const maxNumber = await Exercise.query().max('number as max')
    const nextNumber = Number(maxNumber[0].$extras.max || 0) + 1
    const number = asPositiveNumber(request.input('number'), nextNumber)
    const prerequisiteId = request.input('prerequisiteId')
      ? Number(request.input('prerequisiteId'))
      : null
    if (await Exercise.findBy('number', number)) {
      session.flash('error', 'Ce numéro d’exercice est déjà utilisé.')
      return response.redirect().back()
    }
    const prerequisiteError = await this.validatePrerequisite(null, prerequisiteId, status)
    if (prerequisiteError) {
      session.flash('error', prerequisiteError)
      return response.redirect().back()
    }
    const exercise = await Exercise.create({
      number,
      title,
      slug: slugify(String(request.input('slug', title))),
      description,
      difficulty: asPositiveNumber(request.input('difficulty'), 1),
      category: String(request.input('category', 'JavaScript')).trim() || 'JavaScript',
      points: asPositiveNumber(request.input('points'), 10),
      status,
      starterCode: String(request.input('starterCode', '')),
      hint: String(request.input('hint', '')),
      prerequisiteId,
    })

    await this.log(auth.user!.id, 'exercise.created', 'exercise', String(exercise.id))
    session.flash('success', 'Exercice créé.')
    return response.redirect('/admin/exercises')
  }

  async updateExercise({ params, request, response, auth, session }: HttpContext) {
    const exercise = await Exercise.findOrFail(params.id)
    const status = String(request.input('status', exercise.status)) as ExerciseStatus
    if (!exerciseStatuses.includes(status)) {
      session.flash('error', 'Statut d’exercice invalide.')
      return response.redirect().back()
    }

    const number = asPositiveNumber(request.input('number'), exercise.number)
    const duplicateNumber = await Exercise.query()
      .where('number', number)
      .whereNot('id', exercise.id)
      .first()
    if (duplicateNumber) {
      session.flash('error', 'Ce numéro d’exercice est déjà utilisé.')
      return response.redirect().back()
    }
    const prerequisiteId = request.input('prerequisiteId')
      ? Number(request.input('prerequisiteId'))
      : null
    const prerequisiteError = await this.validatePrerequisite(
      Number(exercise.id),
      prerequisiteId,
      status
    )
    if (prerequisiteError) {
      session.flash('error', prerequisiteError)
      return response.redirect().back()
    }
    if (status === 'archived') {
      const publishedDependent = await Exercise.query()
        .where('prerequisite_id', exercise.id)
        .where('status', 'published')
        .first()
      if (publishedDependent) {
        session.flash(
          'error',
          `Réassignez ou archivez d’abord l’exercice #${publishedDependent.number} qui dépend de celui-ci.`
        )
        return response.redirect().back()
      }
    }

    exercise.title = String(request.input('title', exercise.title)).trim()
    exercise.description = String(request.input('description', exercise.description)).trim()
    exercise.slug = slugify(String(request.input('slug', exercise.slug || exercise.title)))
    exercise.number = number
    exercise.difficulty = asPositiveNumber(request.input('difficulty'), exercise.difficulty)
    exercise.category = String(request.input('category', exercise.category)).trim() || 'JavaScript'
    exercise.points = asPositiveNumber(request.input('points'), exercise.points || 10)
    exercise.status = status
    exercise.starterCode = String(request.input('starterCode', exercise.starterCode || ''))
    exercise.hint = String(request.input('hint', exercise.hint || ''))
    exercise.prerequisiteId = prerequisiteId
    await exercise.save()

    await this.log(auth.user!.id, 'exercise.updated', 'exercise', String(exercise.id))
    session.flash('success', 'Exercice mis à jour.')
    return response.redirect('/admin/exercises')
  }

  async verifyExerciseTests({ params, response, session }: HttpContext) {
    const exercise = await Exercise.findOrFail(params.id)
    const testPath = join(process.cwd(), 'tests', 'exercises', `Exercice${exercise.number}.test.js`)
    try {
      await access(testPath)
      session.flash('success', `Le fichier de tests de l’exercice #${exercise.number} est présent.`)
    } catch {
      session.flash('error', `Aucun fichier de tests trouvé pour l’exercice #${exercise.number}.`)
    }
    return response.redirect().back()
  }
}
