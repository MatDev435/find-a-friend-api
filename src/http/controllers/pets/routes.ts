import { FastifyInstance } from 'fastify'
import { verifyJWT } from '../../middlewares/verify-jwt'
import { create } from './create'
import { fetchPets } from './fetch-pets'
import { getPet } from './get-pet'

export async function petsRoutes(app: FastifyInstance) {
  app.get('/pets', fetchPets)
  app.get('/pets/:petId', getPet)

  app.post('/orgs/:orgId/pets', { onRequest: [verifyJWT] }, create)
}
