import { Auth } from 'aws-amplify';
import {
  Avatar,
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
import { useEffect, useState } from 'react';


interface SignupUserProps {
  user: string,
  fullname: string,
  photoUrl?: string
}

const SignupUser = () => {
  /* const [authUser, setAuthUser] = useState<any | null>(null)
  const checkAuth = async () => {
    try {
      const _authUser = await Auth.currentAuthenticatedUser()
      setAuthUser(_authUser)
      console.log(_authUser)
    } catch (error) {
      setAuthUser(null)
    }
  }

  useEffect(() => {
    checkAuth()
  }, []) */

  return (
    <HStack>
      <VStack align="end" spacing="0">
        <Text fontSize="sm" as="b">{"fullname"}</Text>
        <Text fontSize="xs">{"user.name"}</Text>
      </VStack>
      <Menu>
        <MenuButton>
          <Avatar name={"fullname"} src={"photoUrl"} />
        </MenuButton>
        <MenuList>
          <MenuGroup title="Administrar">
            <MenuItem>Empresas</MenuItem>
          </MenuGroup>
          <MenuDivider />
          <MenuItem>Logs</MenuItem>
          {
            true &&
            <MenuDivider /> &&
            <MenuItem onClick={() => Auth.signOut({ global: true })}>Cerrar Sesión</MenuItem>
          }
        </MenuList>
      </Menu>
    </HStack>
  )
}

export default SignupUser