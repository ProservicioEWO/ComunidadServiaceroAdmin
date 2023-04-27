import { ChevronDownIcon } from '@chakra-ui/icons';
import {
  Text,
  FormControl,
  FormErrorMessage,
  Grid,
  GridItem,
  HStack,
  Input,
  Select,
  Spinner,
  useToast
} from '@chakra-ui/react';
import {
  RefObject,
  useEffect,
  useMemo} from 'react';
import { useForm } from 'react-hook-form';
import useFetch from '../../hooks/useFetch';
import useUpdateData from '../../hooks/useUpdateData';
import { EnterpriseDataResponse } from './AddUserView';
import { EditUserData } from './UserDetailView';

export interface UserEditFormProps {
  formRef: RefObject<HTMLFormElement>
  data: EditUserData
  user: string
  userId?: string
  saveBtn: RefObject<HTMLButtonElement>
}

const UserEditForm = ({ formRef, data, user, userId, saveBtn }: UserEditFormProps) => {
  const toast = useToast()
  const {
    data: fetchData,
    loading: fetchLoading,
    error: fetchError
  } = useFetch<EnterpriseDataResponse[]>("/enterprises")
  const required = useMemo(() => ({ required: true }), [])
  const { handleSubmit, register, formState: { errors }, reset } = useForm<EditUserData>()
  const {
    updateData,
    error: updateError
  } = useUpdateData<EditUserData>()
  const onSubmit = async (values: EditUserData) => {
    console.log(values);
    if (userId) {
      if (saveBtn.current) {
        saveBtn.current.disabled = true
        await updateData("/users/:id", { id: userId }, values)
        saveBtn.current.disabled = false
        reset()
      }
    }
  }

  useEffect(() => {

    reset(data)

    if (saveBtn.current) {
      saveBtn.current.disabled = fetchLoading
    }

    if (updateError) {
      toast({
        title: updateError,
        description: "No se ha podido actualizar los datos de usuario. Por favor, inténtalo más tarde.",
        position: 'bottom-right',
        status: 'error',
        isClosable: true
      })
    }

    if (fetchError) {
      toast({
        title: fetchError,
        description: "No se ha podido cargar la lista de empresas. Por favor, inténtalo más tarde.",
        position: 'bottom-right',
        status: 'error',
        isClosable: true
      })
    }
  }, [fetchError, updateError, fetchLoading])

  return (
    fetchLoading ?
    <HStack>
      <Spinner/>
      <Text>Cargando</Text>
    </HStack> :
    <form ref={formRef} onSubmit={handleSubmit(onSubmit)}>
      <Grid templateColumns="repeat(2, 1fr)" mb={3} gap={3}>
        <Input disabled size="lg" autoComplete="off" placeholder="Usuario" value={user} />
        <FormControl isInvalid={!!errors.key}>
          <Input {...register("key", required)} size="lg" autoComplete="off" placeholder="Clave" />
          <FormErrorMessage>
            La clave de empleado es requerida
          </FormErrorMessage>
        </FormControl>
        <GridItem colSpan={2}>
          <FormControl isInvalid={!!errors.name}>
            <Input {...register("name", required)} size="lg" autoComplete="off" placeholder="Nombre" />
            <FormErrorMessage>
              Introduce un nombre
            </FormErrorMessage>
          </FormControl>
        </GridItem>
        <FormControl isInvalid={!!errors.lastname}>
          <Input {...register("lastname", required)} size="lg" autoComplete="off" placeholder="Apellido paterno" />
          <FormErrorMessage>
            Introduce un apellido paterno
          </FormErrorMessage>
        </FormControl>
        <FormControl isInvalid={!!errors._lastname}>
          <Input {...register("_lastname", required)} size="lg" autoComplete="off" placeholder="Apellido materno" />
          <FormErrorMessage>
            Introduce un apellido materno
          </FormErrorMessage>
        </FormControl>
        <FormControl isInvalid={!!errors.title}>
          <Input {...register("title", required)} size="lg" autoComplete="off" placeholder="Puesto" />
          <FormErrorMessage>
            Introduce un puesto
          </FormErrorMessage>
        </FormControl>
        <FormControl isInvalid={!!errors.enterpriseId}>
          <Select
            icon={fetchLoading ? <Spinner /> : <ChevronDownIcon />}
            isDisabled={fetchLoading || !!fetchError}
            size="lg"
            placeholder="Empresa"
            textColor="gray.500"
            {...register("enterpriseId", {...required, valueAsNumber: true})}>
            {
              !fetchError ?
                fetchData?.map(({ id, shortName }) => (
                  <option key={id} value={id}>{shortName}</option>
                )) :
                <option selected>Error</option>
            }
          </Select>
          <FormErrorMessage>
            Selecciona una empresa
          </FormErrorMessage>
        </FormControl>
      </Grid>
    </form>
  )
}

export default UserEditForm