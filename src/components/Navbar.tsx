import { VStack, Flex, Image } from "@chakra-ui/react"
import { NavLink } from "react-router-dom"
import { VIEW_PADDING } from "../shared/cs-constants"

export interface NavbarProps {
  logo: React.ReactNode,
  logoHref?: string
  children?: React.ReactNode[] | React.ReactNode
}

const Navbar = ({ logo, logoHref, children }: NavbarProps) => {
  return (
    <VStack bg='gray.700' h="full">
      <Flex bg='gray.200' w='full' justifyContent='center' px="2" py={VIEW_PADDING}>
        {(logoHref && <NavLink to={logoHref}>{logo}</NavLink>) ?? logo}
      </Flex>
      <VStack h='full' spacing="8" justify="center" p="1">
        {children}
      </VStack>
    </VStack>
  )
}

export default Navbar