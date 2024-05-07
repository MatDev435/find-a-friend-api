import { describe, it, beforeEach, expect } from 'vitest'
import { InMemoryOrgsRepository } from '../repositories/in-memory/in-memory-orgs-repository'
import { PetsRepository } from '../repositories/pets-repository'
import { GetPetUseCase } from './get-pet'
import { InMemoryPetsRepository } from '../repositories/in-memory/in-memory-pets-repository'
import { SourceNotFoundError } from './errors/source-not-found'

let petsRepository: PetsRepository
let sut: GetPetUseCase

describe('Get Pet Use Case', () => {
  beforeEach(async () => {
    petsRepository = new InMemoryPetsRepository(new InMemoryOrgsRepository())
    sut = new GetPetUseCase(petsRepository)
  })

  it('should be able to get a pet', async () => {
    const createdPet = await petsRepository.create({
      id: 'pet-01',
      name: 'Dog',
      about: 'Dog',
      size: 'small',
      energy_level: 'high',
      dependence_level: 'low',
      environment: 'big',
      org_id: 'org-01',
    })

    const { pet } = await sut.execute({
      petId: createdPet.id,
    })

    expect(pet).toEqual(expect.objectContaining({ id: 'pet-01' }))
  })

  it('should not be able to get a pet with inexistent id', async () => {
    await petsRepository.create({
      id: 'pet-01',
      name: 'Dog',
      about: 'Dog',
      size: 'small',
      energy_level: 'high',
      dependence_level: 'low',
      environment: 'big',
      org_id: 'org-01',
    })

    await expect(() =>
      sut.execute({
        petId: 'inexistent-pet-id',
      }),
    ).rejects.toBeInstanceOf(SourceNotFoundError)
  })
})
