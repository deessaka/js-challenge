import vine from '@vinejs/vine'

export const SubmissionValidator = vine.compile(
  vine.object({
    challengeId: vine.string().trim(),
    code: vine.string().trim().minLength(1).maxLength(100_000),
    language: vine.enum(['javascript']),
    client: vine.enum(['web', 'terminal']),
    clientVersion: vine.string().trim().maxLength(64).optional(),
    idempotencyKey: vine.string().trim().maxLength(128).optional(),
    dryRun: vine.boolean().optional(),
  })
)
