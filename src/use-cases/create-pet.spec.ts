import { describe, it, beforeEach, expect } from 'vitest'
import { OrgsRepository } from '../repositories/orgs-repository'
import { InMemoryOrgsRepository } from '../repositories/in-memory/in-memory-orgs-repository'
import { hash } from 'bcryptjs'
import { PetsRepository } from '../repositories/pets-repository'
import { InMemoryPetsRepository } from '../repositories/in-memory/in-memory-pets-repository'
import { CreatePetUseCase } from './create-pet'
import { SourceNotFoundError } from './errors/source-not-found'

let petsRepository: PetsRepository
let orgsRepository: OrgsRepository
let sut: CreatePetUseCase

describe('Authenticate Org Use Case', () => {
  beforeEach(async () => {
    petsRepository = new InMemoryPetsRepository()
    orgsRepository = new InMemoryOrgsRepository()
    sut = new CreatePetUseCase(petsRepository, orgsRepository)

    await orgsRepository.create({
      id: 'org-01',
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
    })
  })

  it('should be abel to create a pet', async () => {
    const { pet } = await sut.execute({
      name: 'Dog',
      about: 'Dog',
      size: 'small',
      energyLevel: 'high',
      dependenceLevel: 'low',
      environment: 'big',
      orgId: 'org-01',
    })

    expect(pet.id).toEqual(expect.any(String))
  })

  it('should not be abel to create a pet on inexistent org', async () => {
    await expect(() =>
      sut.execute({
        name: 'Dog',
        about: 'Dog',
        size: 'small',
        energyLevel: 'high',
        dependenceLevel: 'low',
        environment: 'big',
        orgId: 'inexistent-org-id',
      }),
    ).rejects.toBeInstanceOf(SourceNotFoundError)
  })
})
