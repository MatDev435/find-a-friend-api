import { describe, it, beforeAll, afterAll, expect } from 'vitest'
import { app } from '../../../app'
import request from 'supertest'
import { createAndAuthenticateOrg } from '../../../utils/tests/create-and-authenticate-org'
import { prisma } from '../../../lib/prisma'

describe('Create Pet E2E', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to create a pet', async () => {
    const { token } = await createAndAuthenticateOrg(app)

    const org = await prisma.org.findFirstOrThrow()

    const response = await request(app.server)
      .post(`/orgs/${org.id}/pets`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Dog',
        about: 'Dog',
        size: 'small',
        energyLevel: 'high',
        dependenceLevel: 'low',
        environment: 'big',
      })

    expect(response.statusCode).toEqual(201)
  })
})
