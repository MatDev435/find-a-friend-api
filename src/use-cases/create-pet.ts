import { Pet } from '@prisma/client'
import { PetsRepository } from '../repositories/pets-repository'
import { OrgsRepository } from '../repositories/orgs-repository'
import { SourceNotFoundError } from './errors/source-not-found'

interface CreatePetUseCaseProps {
  name: string
  about: string
  size: string
  energyLevel: string
  dependenceLevel: string
  environment: string
  orgId: string
}

interface CreatePetUseCaseResponse {
  pet: Pet
}

export class CreatePetUseCase {
  constructor(
    private petsRepository: PetsRepository,
    private orgsRepository: OrgsRepository,
  ) {}

  async execute({
    name,
    about,
    size,
    energyLevel,
    dependenceLevel,
    environment,
    orgId,
  }: CreatePetUseCaseProps): Promise<CreatePetUseCaseResponse> {
    const org = await this.orgsRepository.findById(orgId)

    if (!org) {
      throw new SourceNotFoundError()
    }

    const pet = await this.petsRepository.create({
      name,
      about,
      size,
      energy_level: energyLevel,
      dependence_level: dependenceLevel,
      environment,
      org_id: orgId,
    })

    return { pet }
  }
}
