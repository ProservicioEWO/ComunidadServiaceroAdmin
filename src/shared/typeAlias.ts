import { ComponentWithAs, IconProps } from "@chakra-ui/react"
import { ExternalProgram } from "../models/ExternalProgram"
import { InternalProgram } from "../models/InternalProgram"

export type InputChangeEvent = React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
export type SVGComponent = ComponentWithAs<"svg", IconProps>
export type UUID = string
export type AnyProgram = InternalProgram | ExternalProgram