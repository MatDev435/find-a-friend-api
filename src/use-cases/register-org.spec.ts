import { describe, it, beforeEach, expect } from 'vitest'
import { OrgsRepository } from '../repositories/orgs-repository'
import { RegisterOrgUseCase } from './register-org'
import { InMemoryOrgsRepository } from '../repositories/in-memory/in-memory-orgs-repository'
import { OrgAlreadyExistsError } from './errors/org-already-exists'
import { compare } from 'bcryptjs'

let orgsRepository: OrgsRepository
let sut: RegisterOrgUseCase

describe('Register Org Use Case', () => {
  beforeEach(() => {
    orgsRepository = new InMemoryOrgsRepository()
    sut = new RegisterOrgUseCase(orgsRepository)
  })

  it('should be abel to register', async () => {
    const { org } = await sut.execute({
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

    expect(org.id).toEqual(expect.any(String))
  })

  it('should hash org password', async () => {
    const { org } = await sut.execute({
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

    const isPasswordCorrectlyHash = await compare('123456', org.password_hash)

    expect(isPasswordCorrectlyHash).toEqual(true)
  })

  it('should not be abel to register with same email', async () => {
    await sut.execute({
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

    await expect(() =>
      sut.execute({
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
      }),
    ).rejects.toBeInstanceOf(OrgAlreadyExistsError)
  })
})
