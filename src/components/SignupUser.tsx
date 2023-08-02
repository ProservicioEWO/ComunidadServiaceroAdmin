import useAppContext from '../hooks/useAppContext';
import useAuthContext from '../hooks/useAuthContext';
import useCustomToast from '../hooks/useCustomToast';
import {
  Avatar,
  Box,
  HStack,
  Menu,
  MenuButton,
  MenuDivider,
  MenuGroup,
  MenuItem,
  MenuList,
  Spinner,
  Text,
  VStack
} from '@chakra-ui/react';
import { useCallback, useEffect } from 'react';

const SignupUser = () => {
  const { authSessionData, signOut } = useAuthContext()
  const { userInfo } = useAppContext()
  const { closeAll } = useCustomToast()

  const handleSignOut = useCallback(() => {
    signOut()
    closeAll()
  }, [closeAll, signOut])

  if (userInfo.state.loading) {
    return (
      <Spinner />
    )
  }

  return (
    <HStack>
      <VStack align="end" spacing="0">
        {
          userInfo.data &&
          <Box>
            <Text fontSize="sm" as="b">{`${userInfo.data.name} ${userInfo.data.lastname}`}</Text>
            <Text fontSize="xs">{userInfo.data.username}</Text>
          </Box>
        }
      </VStack>
      <Menu>
        <MenuButton>
          <HStack>
            {
              userInfo.data &&
              <Avatar name={`${userInfo.data.name} ${userInfo.data.lastname}`} src={"photoUrl"} />
            }
          </HStack>
        </MenuButton>
        <MenuList>
          <MenuGroup title="Administrar">
            <MenuItem>Empresas</MenuItem>
          </MenuGroup>
          <MenuDivider />
          <MenuItem>Logs</MenuItem>
          <MenuDivider />
          <MenuItem onClick={handleSignOut}>Cerrar Sesión</MenuItem>
        </MenuList>
      </Menu>
    </HStack >
  )
}

export default SignupUser