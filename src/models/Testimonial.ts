import { UUID } from "../shared/typeAlias";

export interface Testimonial {
  id: UUID
  name: string
  description: string
  entity: string
}