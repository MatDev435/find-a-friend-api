import { Pet, Prisma } from '@prisma/client'

export interface FindManyParams {
  city: string
  page: number
  size?: string
  energyLevel?: string
  dependenceLevel?: string
  environment?: string
}

export interface PetsRepository {
  findMany(params: FindManyParams): Promise<Pet[]>
  create(data: Prisma.PetUncheckedCreateInput): Promise<Pet>
}
