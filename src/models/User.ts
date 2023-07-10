import { UUID } from "../shared/typeAlias"
import { Enterprise } from "./Enterprise"

export interface User {
  id: UUID
  username: string
  key: string
  name: string
  lastname: string
  _lastname: string
  entity: string
  type: string
  enterprise: Enterprise
}