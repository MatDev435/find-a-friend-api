import { describe, it, beforeEach, expect } from 'vitest'
import { InMemoryOrgsRepository } from '../repositories/in-memory/in-memory-orgs-repository'
import { hash } from 'bcryptjs'
import { PetsRepository } from '../repositories/pets-repository'
import { InMemoryPetsRepository } from '../repositories/in-memory/in-memory-pets-repository'
import { FetchPetsUseCase } from './fetch-pets'

let petsRepository: PetsRepository
let orgsRepository: InMemoryOrgsRepository
let sut: FetchPetsUseCase

describe('Fetch Pets Use Case', () => {
  beforeEach(async () => {
    orgsRepository = new InMemoryOrgsRepository()
    petsRepository = new InMemoryPetsRepository(orgsRepository)
    sut = new FetchPetsUseCase(petsRepository)

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

  it('should be able to fetch all pets in city', async () => {
    await petsRepository.create({
      name: 'Dog',
      about: 'Dog',
      size: 'small',
      energy_level: 'high',
      dependence_level: 'low',
      environment: 'big',
      org_id: 'org-01',
    })

    const { pets } = await sut.execute({
      city: 'São Paulo',
      page: 1,
    })

    expect(pets).toHaveLength(1)
    expect(pets).toEqual([expect.objectContaining({ name: 'Dog' })])
  })

  it('should be able to fetch paginated pets', async () => {
    for (let i = 1; i <= 22; i++) {
      await petsRepository.create({
        name: `Pet ${i}`,
        about: 'Dog',
        size: 'small',
        energy_level: 'high',
        dependence_level: 'low',
        environment: 'big',
        org_id: 'org-01',
      })
    }

    const { pets } = await sut.execute({
      city: 'São Paulo',
      page: 2,
    })

    expect(pets).toHaveLength(2)
    expect(pets).toEqual([
      expect.objectContaining({ name: 'Pet 21' }),
      expect.objectContaining({ name: 'Pet 22' }),
    ])
  })

  it('should be able to filter by size', async () => {
    await petsRepository.create({
      name: 'Big Dog',
      about: 'Dog',
      size: 'big',
      energy_level: 'high',
      dependence_level: 'low',
      environment: 'big',
      org_id: 'org-01',
    })

    await petsRepository.create({
      name: 'Small Dog',
      about: 'Dog',
      size: 'small',
      energy_level: 'high',
      dependence_level: 'low',
      environment: 'big',
      org_id: 'org-01',
    })

    const { pets } = await sut.execute({
      city: 'São Paulo',
      page: 1,
      size: 'small',
    })

    expect(pets).toHaveLength(1)
    expect(pets).toEqual([expect.objectContaining({ name: 'Small Dog' })])
  })

  it('should be able to filter by energy', async () => {
    await petsRepository.create({
      name: 'Low Energy Dog',
      about: 'Dog',
      size: 'big',
      energy_level: 'low',
      dependence_level: 'low',
      environment: 'big',
      org_id: 'org-01',
    })

    await petsRepository.create({
      name: 'High Energy Dog',
      about: 'Dog',
      size: 'small',
      energy_level: 'high',
      dependence_level: 'low',
      environment: 'big',
      org_id: 'org-01',
    })

    const { pets } = await sut.execute({
      city: 'São Paulo',
      page: 1,
      energyLevel: 'high',
    })

    expect(pets).toHaveLength(1)
    expect(pets).toEqual([expect.objectContaining({ name: 'High Energy Dog' })])
  })

  it('should be able to filter by dependence', async () => {
    await petsRepository.create({
      name: 'Low Dependence Dog',
      about: 'Dog',
      size: 'big',
      energy_level: 'low',
      dependence_level: 'low',
      environment: 'big',
      org_id: 'org-01',
    })

    await petsRepository.create({
      name: 'High Dependence Dog',
      about: 'Dog',
      size: 'small',
      energy_level: 'high',
      dependence_level: 'high',
      environment: 'big',
      org_id: 'org-01',
    })

    const { pets } = await sut.execute({
      city: 'São Paulo',
      page: 1,
      dependenceLevel: 'high',
    })

    expect(pets).toHaveLength(1)
    expect(pets).toEqual([
      expect.objectContaining({ name: 'High Dependence Dog' }),
    ])
  })

  it('should be able to filter by environment', async () => {
    await petsRepository.create({
      name: 'Small Environment Dog',
      about: 'Dog',
      size: 'big',
      energy_level: 'low',
      dependence_level: 'low',
      environment: 'small',
      org_id: 'org-01',
    })

    await petsRepository.create({
      name: 'Big Environment Dog',
      about: 'Dog',
      size: 'small',
      energy_level: 'high',
      dependence_level: 'high',
      environment: 'big',
      org_id: 'org-01',
    })

    const { pets } = await sut.execute({
      city: 'São Paulo',
      page: 1,
      environment: 'big',
    })

    expect(pets).toHaveLength(1)
    expect(pets).toEqual([
      expect.objectContaining({ name: 'Big Environment Dog' }),
    ])
  })
})
