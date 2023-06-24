import { UUID } from "../shared/typeAlias";

export enum ProgramType {
  internal = "i",
  external = "e"
}

export interface Program {
  id: UUID
  simpleId: string
  name: string
  description: string
  auto: boolean
  cost: string
  cityId: string
  rulesLink: string
  mainLink: string
  advantage: string
  type: ProgramType
  color: string
  section: number
}