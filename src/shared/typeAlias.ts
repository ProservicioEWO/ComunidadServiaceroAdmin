import { ComponentWithAs, IconProps } from "@chakra-ui/react"

export type InputChangeEvent = React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
export type SVGComponent = ComponentWithAs<"svg", IconProps>
export type UUID = string