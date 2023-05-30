import { UUID } from "../shared/typeAlias";

export interface Program {
  id: UUID
  name: string
  auto: false
  description: string
  cost: string
  help: string
  date: string
  locationId: string
  duration: number
  schedule: string
  inscriptionLink: string
  rulesLink: string
  plan: string
  req: string
  cityId: string
  section: number
  type: string
  color: string
}