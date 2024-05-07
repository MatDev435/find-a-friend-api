import { FastifyInstance } from 'fastify'
import request from 'supertest'
import { prisma } from '../../lib/prisma'
import { hash } from 'bcryptjs'

export async function createAndAuthenticateOrg(app: FastifyInstance) {
  await prisma.org.create({
    data: {
      name: 'TypeScript Org',
      email: 'johndoe@example.com',
      author_name: 'John Doe',
      password_hash: await hash('123456', 6),
      whatsapp: '(12) 12345-6789',
      cep: '12345-678',
      street: 'John Doe Street',
      city: 'São Paulo',
      state: 'SP',
      latitude: -20.5499887,
      longitude: -47.3902047,
    },
  })

  const response = await request(app.server).post('/orgs/sessions').send({
    email: 'johndoe@example.com',
    password: '123456',
  })

  const { token } = response.body

  return { token }
}
