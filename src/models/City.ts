import { UUID } from "../shared/typeAlias"

export interface City {
  id: UUID
  alias: string
  name: string
  count: number
}