import { Program } from "./Program"

export interface InternalProgram extends Program {
  date: string
  duration: number
  schedule: string
  plan: string
  req: string
  locationId: string
}