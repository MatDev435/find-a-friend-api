import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { SourceNotFoundError } from '../../../use-cases/errors/source-not-found'
import { makeCreatePetUseCase } from '../../../use-cases/factories/make-create-pet-use-case'

export async function create(request: FastifyRequest, reply: FastifyReply) {
  const createPetParamsSchema = z.object({
    orgId: z.string(),
  })

  const createPetBodySchema = z.object({
    name: z.string(),
    about: z.string(),
    size: z.string(),
    energyLevel: z.string(),
    dependenceLevel: z.string(),
    environment: z.string(),
  })

  const { orgId } = createPetParamsSchema.parse(request.params)

  const { name, about, size, energyLevel, dependenceLevel, environment } =
    createPetBodySchema.parse(request.body)

  try {
    const createPetUseCase = makeCreatePetUseCase()

    await createPetUseCase.execute({
      name,
      about,
      size,
      energyLevel,
      dependenceLevel,
      environment,
      orgId,
    })

    return reply.status(201).send()
  } catch (err) {
    if (err instanceof SourceNotFoundError) {
      return reply.status(404).send({ message: err.message })
    }

    return err
  }
}
