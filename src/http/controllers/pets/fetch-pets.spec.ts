import { describe, it, beforeAll, afterAll, expect } from 'vitest'
import { app } from '../../../app'
import request from 'supertest'
import { createAndAuthenticateOrg } from '../../../utils/tests/create-and-authenticate-org'
import { prisma } from '../../../lib/prisma'

describe('Create Pets E2E', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to fetch pets', async () => {
    await createAndAuthenticateOrg(app)

    const org = await prisma.org.findFirstOrThrow()

    await prisma.pet.create({
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

    const response = await request(app.server)
      .get('/pets/São Paulo')
      .query({
        size: 'small',
        energyLevel: 'high',
        dependenceLevel: 'medium',
        environment: 'big',
      })
      .send()

    expect(response.body.pets).toEqual([
      expect.objectContaining({ name: 'Dog' }),
    ])
  })
})
