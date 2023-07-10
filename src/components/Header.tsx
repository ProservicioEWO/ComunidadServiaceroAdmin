import SignupUser from './SignupUser';
import {
  Card,
  CardBody,
  Heading,
  HStack,
  Icon,
  Spacer,
  Text
} from '@chakra-ui/react';
import { SVGComponent } from '../shared/typeAlias';

export interface HeaderProps {
  text: string
  icon?: SVGComponent
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
          <SignupUser />
        </HStack>
      </CardBody>
    </Card>
  )
}

export default Header