import { Org } from '@prisma/client'
import { OrgsRepository } from '../repositories/orgs-repository'
import { OrgAlreadyExistsError } from './errors/org-already-exists'
import { hash } from 'bcryptjs'

interface RegisterOrgUseCaseProps {
  name: string
  email: string
  authorName: string
  password: string
  whatsapp: string
  cep: string
  street: string
  city: string
  state: string
  latitude: number
  longitude: number
}

interface RegisterOrgUseCaseResponse {
  org: Org
}

export class RegisterOrgUseCase {
  constructor(private orgsRepository: OrgsRepository) {}

  async execute({
    name,
    email,
    authorName,
    password,
    whatsapp,
    cep,
    street,
    city,
    state,
    latitude,
    longitude,
  }: RegisterOrgUseCaseProps): Promise<RegisterOrgUseCaseResponse> {
    const orgWithSameEmail = await this.orgsRepository.findByEmail(email)

    if (orgWithSameEmail) {
      throw new OrgAlreadyExistsError()
    }

    const passwordHash = await hash(password, 6)

    const org = await this.orgsRepository.create({
      name,
      email,
      author_name: authorName,
      password_hash: passwordHash,
      whatsapp,
      cep,
      street,
      city,
      state,
      latitude,
      longitude,
    })

    return { org }
  }
}
