import useFetch from '../../hooks/useFetch';
import { InfoIcon } from '@chakra-ui/icons';
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
  Link,
  Spacer,
  Spinner,
  Text,
  useDisclosure,
  useToast
} from '@chakra-ui/react';
import { useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import UserEditForm from './UserEditForm';
import UserDetails from './UserDetails';
import ProButton from '../ProButton';

export interface UserDetailParams extends Record<string, string> {
  userId: string
}

export interface EditUserData {
  key: string
  name: string
  lastname: string
  _lastname: string
  title: string
  enterpriseId: number
}

export interface UserDetail {
  key: string
  name: string
  lastname: string
  _lastname: string
  user: string
  title: string
  password: string
  enterprise:{
    id: number
    logo: string
  }
}

const UserDetailView = () => {
  const toast = useToast()
  const { userId } = useParams<UserDetailParams>()
  const {
    data,
    loading,
    error,
    refresh
  } = useFetch<UserDetail>("/users/:id?_expand=enterprise", { id: userId })
  const { isOpen, onOpen, onClose } = useDisclosure()
  const btnRef = useRef<HTMLButtonElement>(null)
  const formRef = useRef<HTMLFormElement>(null)
  const saveBtnRef = useRef<HTMLButtonElement>(null)
  const handleClick = () => {
    formRef.current?.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }))
  }

  useEffect(() => {
    refresh()
    if (error) {
      toast({
        title: error,
        description: "Ocurrió un error obteniendo los detalles de usuario. Por favor, inténtalo más tarde.",
        position: 'bottom-right',
        status: 'error',
        isClosable: true
      })
    }
  }, [userId, error])

  return (
    <>
      <Card overflow='hidden' w='xl'>
        <CardHeader
          color='white'
          bg='blue.900'>
          <HStack>
            <InfoIcon />
            <Text fontWeight='bold' fontSize='xl'>Información</Text>
            <Spacer />
            {
              !loading &&
              <Link onClick={onOpen}>Editar</Link>
            }
          </HStack>
        </CardHeader>
        <CardBody>
          {
            loading ?
              <HStack justify='center'>
                <Spinner />
              </HStack> :
              data &&
              <UserDetails data={data} />
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
              data &&
              <UserEditForm
                userId={userId}
                saveBtn={saveBtnRef}
                formRef={formRef}
                data={{
                  key: data.key,
                  name: data.name,
                  lastname: data.lastname,
                  _lastname: data._lastname,
                  enterpriseId: data.enterprise.id,
                  title: data.title
                }}
                user={data.user} />
            }
          </DrawerBody>
          <DrawerFooter>
            <Button variant='outline' mr={3} onClick={onClose}>
              Cancelar
            </Button>
            <Button
              ref={saveBtnRef}
              loadingText="Guardando"
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