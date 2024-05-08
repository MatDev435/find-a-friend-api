import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { makeGetPetUseCase } from '../../../use-cases/factories/make-get-pet-use-case'
import { SourceNotFoundError } from '../../../use-cases/errors/source-not-found'

export async function getPet(request: FastifyRequest, reply: FastifyReply) {
  const getPetParamsSchema = z.object({
    petId: z.string(),
  })

  const { petId } = getPetParamsSchema.parse(request.params)

  try {
    const getPetUseCase = makeGetPetUseCase()

    const { pet } = await getPetUseCase.execute({
      petId,
    })

    return reply.send({ pet })
  } catch (err) {
    if (err instanceof SourceNotFoundError) {
      return reply.status(404).send({ message: err.message })
    }

    return err
  }
}
