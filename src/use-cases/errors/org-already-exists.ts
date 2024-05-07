export class OrgAlreadyExistsError extends Error {
  constructor() {
    super('Org Already exists.')
  }
}
