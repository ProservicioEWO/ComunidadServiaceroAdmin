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
  useDisclosure,
  VStack
} from '@chakra-ui/react';
import { useCallback, useEffect } from 'react';
import EnterprisesConfigView from './enterprises-config/EnterprisesConfigView';
import LogsView from './loginLogs/LogsView';

const SignupUser = () => {
  const {
    isOpen,
    onOpen,
    onClose
  } = useDisclosure()
  const {
    isOpen: isOpenL,
    onOpen: onOpenL,
    onClose: onCloseL
  } = useDisclosure()
  const { signOut } = useAuthContext()
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
    <>
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
              <MenuItem onClick={onOpen}>Empresas</MenuItem>
            </MenuGroup>
            <MenuDivider />
            <MenuItem onClick={onOpenL}>Logs</MenuItem>
            <MenuDivider />
            <MenuItem onClick={handleSignOut}>Cerrar Sesión</MenuItem>
          </MenuList>
        </Menu>
      </HStack>
      <EnterprisesConfigView isOpen={isOpen} onClose={onClose} />
      <LogsView isOpen={isOpenL} onClose={onCloseL} />
    </>
  )
}

export default SignupUser