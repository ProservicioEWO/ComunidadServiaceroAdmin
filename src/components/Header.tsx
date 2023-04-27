import { Card, CardBody, ComponentWithAs, Heading, HStack, Icon, IconProps, Spacer, Text } from '@chakra-ui/react'
import SignupUser from './SignupUser'

export interface HeaderProps {
  text: string
  icon?: ComponentWithAs<"svg", IconProps>
}

const Header = ({ icon, text }: HeaderProps) => {
  return (
    <Card w="full">
      <CardBody>
        <HStack>
          <HStack>
            <Icon as={icon} boxSize="8" stroke="navyBlue.800" />
            <Heading size="lg">
              <Text color='navyBlue.800'>{text}</Text>
            </Heading>
          </HStack>
          <Spacer />
          <SignupUser user="daniel.ibarra" fullname="Daniel Ibarra" />
        </HStack>
      </CardBody>
    </Card>
  )
}

export default Header