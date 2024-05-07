import { Org } from '@prisma/client'
import { OrgsRepository } from '../repositories/orgs-repository'
import { InvalidCredentialsError } from './errors/invalid-credentials'
import { compare } from 'bcryptjs'

interface AuthenticateOrgUseCaseProps {
  email: string
  password: string
}

interface AuthenticateOrgUseCaseResponse {
  org: Org
}

export class AuthenticateOrgUseCase {
  constructor(private orgsRepository: OrgsRepository) {}

  async execute({
    email,
    password,
  }: AuthenticateOrgUseCaseProps): Promise<AuthenticateOrgUseCaseResponse> {
    const org = await this.orgsRepository.findByEmail(email)

    if (!org) {
      throw new InvalidCredentialsError()
    }

    const isPasswordCorrect = await compare(password, org.password_hash)

    if (!isPasswordCorrect) {
      throw new InvalidCredentialsError()
    }

    return { org }
  }
}
