import { describe, it, beforeAll, afterAll, expect } from 'vitest'
import { app } from '../../../app'
import request from 'supertest'
import { createAndAuthenticateOrg } from '../../../utils/tests/create-and-authenticate-org'
import { prisma } from '../../../lib/prisma'

describe('Get Pet E2E', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to get pet details', async () => {
    await createAndAuthenticateOrg(app)

    const org = await prisma.org.findFirstOrThrow()

    const pet = await prisma.pet.create({
      data: {
        name: 'Dog',
        about: 'Dog',
        size: 'small',
        energy_level: 'high',
        dependence_level: 'medium',
        environment: 'big',
        org_id: org.id,
      },
    })

    const response = await request(app.server).get(`/pets/${pet.id}`).send()

    expect(response.statusCode).toEqual(200)
    expect(response.body.pet).toEqual(expect.objectContaining({ name: 'Dog' }))
  })
})
