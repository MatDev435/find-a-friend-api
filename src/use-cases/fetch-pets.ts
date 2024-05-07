import { Pet } from '@prisma/client'
import { PetsRepository } from '../repositories/pets-repository'

interface FetchPetsUseCaseProps {
  city: string
  size?: string
  energyLevel?: string
  dependenceLevel?: string
  environment?: string
  page: number
}

interface FetchPetsUseCaseResponse {
  pets: Pet[]
}

export class FetchPetsUseCase {
  constructor(private petsRepository: PetsRepository) {}

  async execute({
    city,
    size,
    energyLevel,
    dependenceLevel,
    environment,
    page,
  }: FetchPetsUseCaseProps): Promise<FetchPetsUseCaseResponse> {
    const pets = await this.petsRepository.findMany({
      city,
      page,
      size,
      energyLevel,
      dependenceLevel,
      environment,
    })

    return { pets }
  }
}
