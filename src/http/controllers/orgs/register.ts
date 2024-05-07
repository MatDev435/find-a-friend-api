import { FastifyReply, FastifyRequest } from 'fastify'
import { makeRegisterOrgUseCase } from '../../../use-cases/factories/make-register-org-use-case'
import { z } from 'zod'
import { OrgAlreadyExistsError } from '../../../use-cases/errors/org-already-exists'

export async function register(request: FastifyRequest, reply: FastifyReply) {
  const registerOrgBodySchema = z.object({
    name: z.string(),
    email: z.string().email(),
    authorName: z.string(),
    password: z.string().min(6),
    whatsapp: z.string(),
    cep: z.string(),
    street: z.string(),
    city: z.string(),
    state: z.string(),
    latitude: z.number().refine((value) => {
      return Math.abs(value) <= 90
    }),
    longitude: z.number().refine((value) => {
      return Math.abs(value) <= 180
    }),
  })

  const {
    name,
    email,
    authorName,
    password,
    whatsapp,
    cep,
    street,
    city,
    state,
    latitude,
    longitude,
  } = registerOrgBodySchema.parse(request.body)

  try {
    const registerOrgUseCase = makeRegisterOrgUseCase()

    await registerOrgUseCase.execute({
      name,
      email,
      authorName,
      password,
      whatsapp,
      cep,
      street,
      city,
      state,
      latitude,
      longitude,
    })

    return reply.status(201).send()
  } catch (err) {
    if (err instanceof OrgAlreadyExistsError) {
      return reply.status(409).send({ message: err.message })
    }

    return err
  }
}
