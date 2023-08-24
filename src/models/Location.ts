import { UUID } from "../shared/typeAlias";

export interface Location {
  id: UUID,
  name: string,
  siteId: string
  imageKey: string
  videoKey: string
}