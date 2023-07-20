import useAppContext from '../hooks/useAppContext';
import useAuthContext from '../hooks/useAuthContext';
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
import { CognitoUser } from 'amazon-cognito-identity-js';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useCustomToast from '../hooks/useCustomToast';

const SignupUser = () => {
  const navigate = useNavigate()
  const { closeAll } = useCustomToast()
  const { current, signOut } = useAuthContext()
  const { userInfo } = useAppContext()

  const [currentUser, setCurrentUser] = useState<CognitoUser | null>(null)
  // const [userInfo, setUserInfo] = useState<User | null>(null)
  // const [loading, setLoading] = useState(false)

  const handleSignOut = useCallback(async () => {
    await signOut()
    closeAll()
    navigate("/login")
  }, [])

  useEffect(() => {

    if (current.userLoading === true || current.userLoading === null) {
      return
    }

    if (current.cognitoUser) {
      current.cognitoUser.getUserAttributes((err, attr) => {
        if (err) {
          console.log(err)
        }

        const sub = attr?.find(e => e.Name === 'sub')?.Value
        if (sub) {
          userInfo.fetch(sub)
        }
      })
    }
  }, [current.userLoading])

  useEffect(() => {
    if (userInfo.state.error) {
      console.log(userInfo.state.error)
    }

    if (current.userError) {
      console.log(current.userError)
    }
  }, [userInfo.state.error, current.userError])

  if (userInfo.state.loading || current.userLoading) {
    return <Spinner />
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