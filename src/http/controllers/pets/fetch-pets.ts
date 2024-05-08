import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { makeFetchPetsUseCase } from '../../../use-cases/factories/make-fetch-pets-use-case'

export async function fetchPets(request: FastifyRequest, reply: FastifyReply) {
  const fetchPetsParamsSchema = z.object({
    city: z.string(),
  })

  const fetchPetsQueryParams = z.object({
    page: z.coerce.number().default(1),
    size: z.string().nullable(),
    energyLevel: z.string().nullable(),
    dependenceLevel: z.string().nullable(),
    environment: z.string().nullable(),
  })

  const { city } = fetchPetsParamsSchema.parse(request.params)

  const { page, size, energyLevel, dependenceLevel, environment } =
    fetchPetsQueryParams.parse(request.query)

  const fetchPetsUseCase = makeFetchPetsUseCase()

  const { pets } = await fetchPetsUseCase.execute({
    city,
    page,
    size: size ?? undefined,
    energyLevel: energyLevel ?? undefined,
    dependenceLevel: dependenceLevel ?? undefined,
    environment: environment ?? undefined,
  })

  return reply.send({ pets })
}
