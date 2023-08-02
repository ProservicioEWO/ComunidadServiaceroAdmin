import useAppContext from '../../hooks/useAppContext';
import useCustomToast from '../../hooks/useCustomToast';
import UserDetails from './UserDetails';
import UserEditForm from './UserEditForm';
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  HStack,
  IconButton,
  Spacer,
  Spinner,
  Text,
  useDisclosure
} from '@chakra-ui/react';
import { EditIcon, InfoIcon } from '@chakra-ui/icons';
import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { User } from '../../models/User';

export interface UserDetailParams extends Record<string, string> {
  userId: string
}

export interface EditUserData {
  key: string
  name: string
  lastname: string
  _lastname: string
  type: string
  enterpriseId: number,
  entity: string
}

const UserDetailView = () => {
  const [currentUser, setCurrentUser] = useState<User | undefined>(undefined)
  const { errorToast, successToast } = useCustomToast()
  const { users, password } = useAppContext()
  const [isLoading, setIsLoading] = useState({state: false, text: ""})
  const { userId } = useParams<UserDetailParams>()
  // const {
  //   data,
  //   loading,
  //   error,
  //   fetchData
  // } = useFetch<UserDetail>()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const btnRef = useRef<HTMLButtonElement>(null)
  const formRef = useRef<HTMLFormElement>(null)
  
  const handleClick = () => {
    formRef.current?.dispatchEvent(new Event('submit', {
      cancelable: true,
      bubbles: true
    }))
  }
  const handleSuccess = (newValues: EditUserData) => {
    //fetchData("/users/:id?_expand=enterprise", { id: userId })
    if (users.get) {
      users.set([...users.get.map(e => String(e.id) === userId ? { ...e, ...newValues } : e)])
      successToast("Se actualizó la información de usuario con éxito")
      onClose()
    }
  }

  useEffect(() => {
    setCurrentUser(users.get?.find(e => e.id === userId))
  }, [users.get])

  useEffect(() => {
    //fetchData("/users/:id?_expand=enterprise", { id: userId })
    password.fetch(userId)
  }, [userId])

  useEffect(() => {
    if (password.state.error) {
      errorToast(password.state.error)
    }
  }, [password.state.error])

  return (
    <>
      <Card overflow='hidden' w='2xl'>
        <CardHeader
          color='white'
          bg='blue.900'>
          <HStack>
            <InfoIcon />
            <Text fontWeight='bold' fontSize='xl'>Información</Text>
            <Spacer />
            {
              <HStack>
                {/* <IconButton icon={<RepeatIcon />} colorScheme='whiteAlpha' variant='ghost' onClick={refresh} aria-label={'recargar informacion'} /> */}
                <IconButton
                  icon={<EditIcon />}
                  isDisabled={password.state.loading}
                  colorScheme='whiteAlpha'
                  variant='ghost'
                  onClick={onOpen}
                  aria-label={'editar usuario'} />
              </HStack>
            }
          </HStack>
        </CardHeader>
        <CardBody>
          {
            users.state.loading ?
              <HStack justify='center'>
                <Spinner />
              </HStack> :
              users.get &&
              <UserDetails
                data={users.get.find(e => e.id === userId)} />
          }
        </CardBody>
      </Card >
      <Drawer
        size='md'
        isOpen={isOpen}
        placement='right'
        onClose={onClose}
        finalFocusRef={btnRef}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Editando usuario</DrawerHeader>
          <DrawerBody>
            {
              currentUser &&
              <UserEditForm
                userId={userId}
                setIsLoading={setIsLoading}
                onSuccess={handleSuccess}
                formRef={formRef}
                data={{
                  key: currentUser.key,
                  name: currentUser.name,
                  lastname: currentUser.lastname,
                  _lastname: currentUser._lastname,
                  enterpriseId: currentUser.enterprise.id,
                  entity: currentUser.entity,
                  type: currentUser.type
                }}
                user={currentUser.username} />
            }
          </DrawerBody>
          <DrawerFooter>
            <Button variant='outline' mr={3} onClick={onClose}>
              Cancelar
            </Button>
            <Button
              isLoading={isLoading.state}
              loadingText={isLoading.text}
              colorScheme='purple'
              onClick={handleClick}>
              Guardar
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  )
}

export default UserDetailView