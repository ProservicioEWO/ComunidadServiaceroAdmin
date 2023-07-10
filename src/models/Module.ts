import { UUID } from "../shared/typeAlias";
import { Log } from "./Log";

export interface Module {
  id: UUID
  name: string
  color: string
  logs: Log[]
}