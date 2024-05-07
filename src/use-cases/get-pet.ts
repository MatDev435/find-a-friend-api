import { Pet } from '@prisma/client'
import { PetsRepository } from '../repositories/pets-repository'
import { SourceNotFoundError } from './errors/source-not-found'

interface GetPetUseCaseProps {
  petId: string
}

interface GetPetUseCaseResponse {
  pet: Pet
}

export class GetPetUseCase {
  constructor(private petsRepository: PetsRepository) {}

  async execute({ petId }: GetPetUseCaseProps): Promise<GetPetUseCaseResponse> {
    const pet = await this.petsRepository.findById(petId)

    if (!pet) {
      throw new SourceNotFoundError()
    }

    return { pet }
  }
}
