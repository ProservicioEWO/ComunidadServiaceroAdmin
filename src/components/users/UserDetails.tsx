import { VStack, StackDivider, Flex, HStack, Stat, StatLabel, StatNumber } from '@chakra-ui/react'
import DisplayPassword from '../DisplayPassword'
import { UserDetail } from './UserDetailView'

export interface UserDetailsProps {
  data: UserDetail
}

const UserDetails = ({ data }: UserDetailsProps) => {
  const { enterprise: { logo }, user, key, name, lastname, _lastname, title, password } = data
  return (
    <VStack align='stretch' divider={<StackDivider />}>
      <Flex justify='center'>
        <img src={logo} />
      </Flex>
      <HStack align='stretch'>
        <Stat>
          <StatLabel>Usuario</StatLabel>
          <StatNumber>{user}</StatNumber>
        </Stat>
        <Stat>
          <StatLabel>Clave</StatLabel>
          <StatNumber>{key}</StatNumber>
        </Stat>
      </HStack>
      <HStack align='stretch'>
        <Stat>
          <StatLabel>Nombre</StatLabel>
          <StatNumber>{name}</StatNumber>
        </Stat>
        <Stat>
          <StatLabel>Apellido paterno</StatLabel>
          <StatNumber>{lastname}</StatNumber>
        </Stat>
        <Stat>
          <StatLabel>Apellido materno</StatLabel>
          <StatNumber>{_lastname}</StatNumber>
        </Stat>
      </HStack>
      <HStack align='stretch'>
        <Stat>
          <StatLabel>Puesto</StatLabel>
          <StatNumber>{title}</StatNumber>
        </Stat>
        <Stat>
          <StatLabel>Contraseña</StatLabel>
          <StatNumber>
            <DisplayPassword value={password} />
          </StatNumber>
        </Stat>
      </HStack>
    </VStack>
  )
}

export default UserDetails