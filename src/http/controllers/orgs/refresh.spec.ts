import { describe, it, beforeAll, afterAll, expect } from 'vitest'
import { app } from '../../../app'
import request from 'supertest'
import { createAndAuthenticateOrg } from '../../../utils/tests/create-and-authenticate-org'

describe('Refresh Token E2E', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to refresh a token', async () => {
    await request(app.server).post('/orgs').send({
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

    const authResponse = await request(app.server).post('/orgs/sessions').send({
      email: 'johndoe@example.com',
      password: '123456',
    })

    const cookies = authResponse.get('Set-Cookie') as string[]

    const response = await request(app.server)
      .post('/refresh')
      .set('Cookie', cookies)
      .send()

    expect(response.statusCode).toEqual(200)
    expect(response.body).toEqual({
      token: expect.any(String),
    })
    expect(response.get('Set-Cookie')).toEqual([
      expect.stringContaining('refreshToken='),
    ])
  })
})
