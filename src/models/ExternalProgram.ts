import { Program } from "./Program"

export interface ExternalProgram extends Program {
  institution: string
  websiteLink: string
  email: string
  phone: string
  address: string
}