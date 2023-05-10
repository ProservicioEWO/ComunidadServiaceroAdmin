import { UUID } from "../shared/typeAlias";

export interface Location {
  id: UUID,
  name: string,
  cityId: number
}