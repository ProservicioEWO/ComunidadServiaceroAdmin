import { VStack, StackDivider, Flex, HStack, Stat, StatLabel, StatNumber } from '@chakra-ui/react'
import useAppContext from '../../hooks/useAppContext'
import { User } from '../../models/User'
import DisplayPassword from '../DisplayPassword'

export interface UserDetailsProps {
  data: User | undefined
}

const UserDetails = ({ data }: UserDetailsProps) => {
  const { password } = useAppContext()
  const {
    enterprise: { logo },
    user,
    key,
    name,
    lastname,
    _lastname,
    type,
    entity
  } = data ?? { enterprise: {} }
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
          <StatLabel>Entidad</StatLabel>
          <StatNumber>{entity}</StatNumber>
        </Stat>
        <Stat>
          <StatLabel>Tipo</StatLabel>
          <StatNumber>{type}</StatNumber>
        </Stat>
        <Stat>
          <StatLabel>Contraseña</StatLabel>
          <StatNumber>
            <DisplayPassword value={password.value} isLoading={password.state.loading} />
          </StatNumber>
        </Stat>
      </HStack>
    </VStack>
  )
}

export default UserDetails