import Lottie from 'lottie-react';
import PasswordReqInfo from './PasswordReqInfo';
import useAppContext from '../../hooks/useAppContext';
import useCustomToast from '../../hooks/useCustomToast';
import useFetch from '../../hooks/useFetch';
import useInsertData from '../../hooks/useInsertData';
import {
  AbsoluteCenter,
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  Grid,
  Heading,
  HStack,
  Input,
  InputGroup,
  InputRightElement,
  Select,
  Spacer,
  Spinner,
  VStack
} from '@chakra-ui/react';
import { AddIcon, ChevronDownIcon, InfoOutlineIcon } from '@chakra-ui/icons';
import { Enterprise } from '../../models/Enterprise';
import { InputChangeEvent, UUID } from '../../shared/typeAlias';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { User } from '../../models/User';
import DesktopAnimation from '../../lotties/desktop_lottie_2.json'
import useAuthContext from '../../hooks/useAuthContext';

export interface NewUser extends Omit<User, 'enterprise' | 'id'> {
  enterpriseId: number
}

export interface AddUserFormValues {
  username: string,
  key: string,
  password: string,
  name: string,
  lastname: string,
  _lastname: string,
  entity: string,
  type: string,
  enterpriseId: number
}

const createUserFromValues = (values: AddUserFormValues): NewUser => ({ ...values })

const AddUserView = () => {
  const { authSessionData: { accessToken, idToken } } = useAuthContext()
  const { newId, users } = useAppContext()
  const { errorToast, successToast } = useCustomToast()
  const [entities, setEntitites] = useState<string[]>([])
  const {
    insertData,
    response,
    loading: insertLoading,
    error: insertError,
  } = useInsertData<NewUser>()
  const {
    data,
    loading: fetchLoading,
    error: fetchError,
    fetchData: fetchEnt
  } = useFetch<Enterprise[]>()
  const {
    handleSubmit,
    register,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<AddUserFormValues>()

  const onSubmit = async (values: AddUserFormValues) => {
    const enterprise = data?.find(e => e.id === Number(values.enterpriseId))
    if (enterprise) {
      const newUser = createUserFromValues(values)
      const responseData = await insertData("/users", newUser, {
        jwt: accessToken!
      })
      if (responseData) {
        users.set([...(users.get ?? []), { ...newUser, id: responseData.id, enterprise }])
        successToast("Se ha insertado el usuario con exito")
        reset()
      }
    }
  }
  const handleSelectChange = ({ target: { value } }: InputChangeEvent) => {
    const ent = data?.find(({ id }) => id === Number(value))
    setEntitites(ent?.entities ?? [])
  }

  useEffect(() => {
    fetchEnt("/enterprises", { jwt: accessToken! })
  }, [])

  useEffect(() => {
    if (insertError) {
      errorToast(insertError)
    }
    if (fetchError) {
      errorToast(fetchError)
    }
  }, [insertError, fetchError])
  return (
    <HStack>
      <VStack align="start">
        <Heading size="md" mb="3">
          Agregando un nuevo usuario
        </Heading>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid templateColumns="repeat(3, 1fr)" mb={3} gap={3}>
            <FormControl isInvalid={!!errors.key}>
              <Input {...register("key", { required: true })}
                size="lg"
                autoComplete="off"
                placeholder="Clave" />
              <FormErrorMessage>
                La clave de empleado es requerida
              </FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={!!errors.username}>
              <Input {...register("username", { required: true })}
                size="lg"
                autoComplete="off"
                placeholder="Usuario" />
              <FormErrorMessage>
                El nombre de usuario es requerido"
              </FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={!!errors.password}>
              <InputGroup>
                <InputRightElement>
                  <AbsoluteCenter>
                    <PasswordReqInfo>
                      <InfoOutlineIcon color='gray.500' />
                    </PasswordReqInfo>
                  </AbsoluteCenter>
                </InputRightElement>
                <Input type="password" {...register("password", { required: true })}
                  size="lg"
                  autoComplete="off"
                  placeholder="Contraseña" />
              </InputGroup>
              <FormErrorMessage>
                Introduce una contraseña
              </FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={!!errors.name}>
              <Input {...register("name", { required: true })}
                size="lg"
                autoComplete="off"
                placeholder="Nombre" />
              <FormErrorMessage>
                Introduce un nombre
              </FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={!!errors.lastname}>
              <Input {...register("lastname", { required: true })}
                size="lg"
                autoComplete="off"
                placeholder="Apellido paterno" />
              <FormErrorMessage>
                Introduce un apellido paterno
              </FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={!!errors._lastname}>
              <Input {...register("_lastname", { required: true })}
                size="lg"
                autoComplete="off"
                placeholder="Apellido materno" />
              <FormErrorMessage>
                Introduce un apellido materno
              </FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={!!errors.enterpriseId}>
              <Select
                {...register("enterpriseId", { required: true, valueAsNumber: true })}
                icon={fetchLoading ? <Spinner /> : <ChevronDownIcon />}
                isDisabled={fetchLoading || !!fetchError}
                size="lg"
                placeholder="Empresa"
                textColor="gray.500"
                onChange={handleSelectChange}>
                {
                  !fetchError ?
                    data?.map(({ id, shortname }) => (
                      <option key={id} value={id}>{shortname}</option>
                    )) :
                    <option selected>Error</option>
                }
              </Select>
              <FormErrorMessage>
                Selecciona una empresa
              </FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={!!errors.entity}>
              <Select
                icon={fetchLoading ? <Spinner /> : <ChevronDownIcon />}
                isDisabled={fetchLoading || !!fetchError}
                size="lg"
                placeholder="Entidad"
                textColor="gray.500"
                {...register("entity", { required: true })}>
                {
                  !fetchError ?
                    entities.map((e, i) => (
                      <option key={i} value={e}>{e}</option>
                    )) :
                    <option selected>Error</option>
                }
              </Select>
              <FormErrorMessage>
                Selecciona una entidad
              </FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={!!errors.type}>
              <Select
                {...register("type", { required: true })}
                placeholder='Tipo'
                textColor="gray.500"
                size="lg">
                {
                  ["Q", "S"].map((e, i) => (
                    <option key={i} value={e}>{e}</option>
                  ))
                }
              </Select>
              <FormErrorMessage>
                Selecciona un tipo
              </FormErrorMessage>
            </FormControl>
          </Grid>
          <Button
            type="submit"
            bg="purple.600"
            isDisabled={fetchLoading || !!fetchError}
            isLoading={insertLoading}
            loadingText="Creando usuario"
            leftIcon={<AddIcon />}
            textColor="white">
            Crear
          </Button>
        </form>
      </VStack>
      <Spacer />
      <Box w='sm'>
        <Lottie animationData={DesktopAnimation} />
      </Box>
    </HStack>
  )
}

export default AddUserView