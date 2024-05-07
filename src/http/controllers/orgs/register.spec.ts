import { describe, it, beforeAll, afterAll, expect } from 'vitest'
import { app } from '../../../app'
import request from 'supertest'

describe('Register Org E2E', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to register', async () => {
    const response = await request(app.server).post('/orgs').send({
      name: 'TypeScript Org',
      email: 'johndoe@example.com',
      authorName: 'John Doe',
      password: '123456',
      whatsapp: '(12) 12345-6789',
      cep: '12345-678',
      street: 'John Doe Street',
      city: 'São Paulo',
      state: 'SP',
      latitude: -20.5499887,
      longitude: -47.3902047,
    })

    expect(response.statusCode).toEqual(201)
  })
})
