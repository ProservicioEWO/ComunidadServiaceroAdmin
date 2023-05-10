import {
  Avatar,
  Button,
  HStack,
  Menu,
  MenuButton,
  MenuDivider,
  MenuGroup,
  MenuItem,
  MenuList,
  Text,
  VStack
} from '@chakra-ui/react';

interface SignupUserProps {
  user: string,
  fullname: string,
  photoUrl?: string
}

const SignupUser = ({ user, fullname, photoUrl }: SignupUserProps) => {
  return (
    <HStack>
      <VStack align="end" spacing="0">
        <Text fontSize="sm" as="b">{fullname}</Text>
        <Text fontSize="xs">{user}</Text>
      </VStack>
      <Menu>
        <MenuButton>
          <Avatar name={fullname} src={photoUrl} />
        </MenuButton>
        <MenuList>
          <MenuGroup title="Administrar">
            <MenuItem>Empresas</MenuItem>
          </MenuGroup>
          <MenuDivider />
          <MenuItem>Logs</MenuItem>
          <MenuDivider />
          <MenuItem>Cerrar Sesión</MenuItem>
        </MenuList>
      </Menu>
    </HStack>
  )
}

export default SignupUser