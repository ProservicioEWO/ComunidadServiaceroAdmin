import { Frequency } from "../shared/typeAlias"
import { Program } from "./Program"

export interface InternalProgram extends Program {
  date: string
  end: string
  duration: string
  schedule: string
  plan: string
  req: string
  locationId: string
  auto: boolean
  color: string
  frequency: Frequency
  days: number[]
}