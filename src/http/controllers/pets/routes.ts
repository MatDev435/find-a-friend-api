import { FastifyInstance } from 'fastify'
import { verifyJWT } from '../../middlewares/verify-jwt'
import { create } from './create'
import { fetchPets } from './fetch-pets'

export async function petsRoutes(app: FastifyInstance) {
  app.get('/pets/:city', fetchPets)

  app.post('/orgs/:orgId/pets', { onRequest: [verifyJWT] }, create)
}
