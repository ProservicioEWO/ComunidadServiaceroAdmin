import { UUID } from "../shared/typeAlias";

export enum ProgramType {
  internal = "i",
  external = "e"
}

export interface Program {
  id: UUID
  simpleId: string
  name: string
  shortName: string
  description: string
  cost: string
  cityId: string
  rulesLink: string
  mainLink: string
  advantage: string
  type: ProgramType
  section: number
}