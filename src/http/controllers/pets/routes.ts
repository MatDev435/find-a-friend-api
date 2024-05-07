import { FastifyInstance } from 'fastify'
import { verifyJWT } from '../../middlewares/verify-jwt'
import { create } from './create'

export async function petsRoutes(app: FastifyInstance) {
  app.post('/orgs/:orgId/pets', { onRequest: [verifyJWT] }, create)
}
