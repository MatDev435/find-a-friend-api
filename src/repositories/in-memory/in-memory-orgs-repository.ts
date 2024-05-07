import { Org, Prisma } from '@prisma/client'
import { OrgsRepository } from '../orgs-repository'
import { Decimal } from '@prisma/client/runtime/library'
import { randomUUID } from 'node:crypto'

export class InMemoryOrgsRepository implements OrgsRepository {
  private items: Org[] = []

  async findById(id: string) {
    const org = this.items.find((item) => item.id === id)

    if (!org) {
      return null
    }

    return org
  }

  async findByEmail(email: string) {
    const org = this.items.find((item) => item.email === email)

    if (!org) {
      return null
    }

    return org
  }

  async create(data: Prisma.OrgCreateInput) {
    const org = {
      id: data.id ?? randomUUID(),
      name: data.name,
      email: data.email,
      author_name: data.author_name,
      password_hash: data.password_hash,
      whatsapp: data.whatsapp,
      cep: data.cep,
      street: data.street,
      city: data.city,
      state: data.state,
      latitude: new Decimal(data.latitude.toString()),
      longitude: new Decimal(data.longitude.toString()),
      created_at: new Date(),
    } as Org

    this.items.push(org)

    return org
  }
}
