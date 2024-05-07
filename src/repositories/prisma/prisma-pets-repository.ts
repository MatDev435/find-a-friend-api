import { Prisma } from '@prisma/client'
import { prisma } from '../../lib/prisma'
import { FindManyParams, PetsRepository } from '../pets-repository'

export class PrismaPetsRepository implements PetsRepository {
  async findById(id: string) {
    const pet = await prisma.pet.findUnique({
      where: {
        id,
      },
    })

    return pet
  }

  async findMany(params: FindManyParams) {
    const pets = await prisma.pet.findMany({
      where: {
        size: params.size,
        energy_level: params.energyLevel,
        dependence_level: params.dependenceLevel,
        environment: params.environment,

        org: {
          city: {
            contains: params.city,
            mode: 'insensitive',
          },
        },
      },
      take: params.page * 20,
      skip: (params.page - 1) * 20,
    })

    return pets
  }

  async create(data: Prisma.PetUncheckedCreateInput) {
    const pet = await prisma.pet.create({
      data,
    })

    return pet
  }
}
