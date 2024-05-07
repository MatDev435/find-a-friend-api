import { Pet, Prisma } from '@prisma/client'
import { PetsRepository } from '../pets-repository'
import { randomUUID } from 'crypto'

export class InMemoryPetsRepository implements PetsRepository {
  private items: Pet[] = []

  async create(data: Prisma.PetUncheckedCreateInput) {
    const pet = {
      id: randomUUID(),
      name: data.name,
      about: data.about,
      size: data.size,
      energy_level: data.energy_level,
      dependence_level: data.dependence_level,
      environment: data.environment,
      org_id: data.org_id,
    } as Pet

    this.items.push(pet)

    return pet
  }
}
