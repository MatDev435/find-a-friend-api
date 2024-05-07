import { PrismaPetsRepository } from '../../repositories/prisma/prisma-pets-repository'
import { FetchPetsUseCase } from '../fetch-pets'

export function makeFetchPetsUseCase() {
  const petsRepository = new PrismaPetsRepository()
  const useCase = new FetchPetsUseCase(petsRepository)

  return useCase
}
