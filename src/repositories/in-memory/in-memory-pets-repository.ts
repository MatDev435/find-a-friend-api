import { Pet, Prisma } from '@prisma/client'
import { FindManyParams, PetsRepository } from '../pets-repository'
import { randomUUID } from 'crypto'
import { InMemoryOrgsRepository } from './in-memory-orgs-repository'

export class InMemoryPetsRepository implements PetsRepository {
  private items: Pet[] = []

  constructor(private orgsRepository: InMemoryOrgsRepository) {}

  async findById(id: string) {
    const pet = this.items.find((item) => item.id === id)

    if (!pet) {
      return null
    }

    return pet
  }

  async findMany(params: FindManyParams) {
    const orgsInCity = await this.orgsRepository.findManyByCity(params.city)

    const pets = this.items
      .filter((item) => orgsInCity.some((org) => item.org_id === org.id))
      .filter((item) => (params.size ? item.size === params.size : true))
      .filter((item) =>
        params.energyLevel ? item.energy_level === params.energyLevel : true,
      )
      .filter((item) =>
        params.dependenceLevel
          ? item.dependence_level === params.dependenceLevel
          : true,
      )
      .filter((item) =>
        params.environment ? item.environment === params.environment : true,
      )
      .splice((params.page - 1) * 20, params.page * 20)

    return pets
  }

  async create(data: Prisma.PetUncheckedCreateInput) {
    const pet = {
      id: data.id ?? randomUUID(),
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
