import useFetch from '../../hooks/useFetch';
import useInsertData from '../../hooks/useInsertData';
import { AddIcon, ChevronDownIcon } from '@chakra-ui/icons';
import {
  Button,
  FormControl,
  FormErrorMessage,
  Grid,
  GridItem,
  Heading,
  HStack,
  Input,
  Select,
  Spinner,
  useToast,
  VStack
  } from '@chakra-ui/react';
import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';

export interface EnterpriseDataResponse {
  id: number,
  shortName: string,
  name: string,
  alias: string
}

export interface AddUserFormValues {
  user: string,
  key: string,
  password: string,
  name: string,
  lastname: string,
  _lastname: string,
  title: string,
  enterpriseId: number
}

const AddUserView = () => {
  const toast = useToast()
  const { insertData, error } = useInsertData<AddUserFormValues>()
  const { data, loading, error: fetchError } = useFetch<EnterpriseDataResponse[]>("/enterprises")
  const { handleSubmit, register, reset, formState: { errors, isSubmitting } } = useForm<AddUserFormValues>()
  const onSubmit = async (values: AddUserFormValues) => {
    if (data) {
      const alias = data.find(e => e.id === Number(values.enterpriseId))?.alias
      if (alias) {
        await insertData("/users", values)
        toast({ description: "Se agregó el nuevo usuario con éxito", status: "success", isClosable: true })
        reset()
      }
    }
  }
  const required = useMemo(() => ({ required: true }), [])
  useEffect(() => {
    if (error) {
      toast({
        title: error,
        description: "Ocurrió un error. Por favor, inténtalo más tarde.",
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
  }, [error, fetchError])
  return (
    <VStack align="start">
      <Heading size="md" mb="3">
        Agregando un nuevo usuario
      </Heading>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid templateColumns="repeat(3, 1fr)" mb={3} gap={3}>
          <FormControl isInvalid={!!errors.key}>
            <Input {...register("key", required)} size="lg" autoComplete="off" placeholder="Clave" />
            <FormErrorMessage>
              La clave de empleado es requerida
            </FormErrorMessage>
          </FormControl>
          <FormControl isInvalid={!!errors.name}>
            <Input {...register("user", required)} size="lg" autoComplete="off" placeholder="Usuario" />
            <FormErrorMessage>
              El nombre de usuario es requerido"
            </FormErrorMessage>
          </FormControl>
          <FormControl isInvalid={!!errors.password}>
            <Input type="password" {...register("password", required)} size="lg" autoComplete="off" placeholder="Contraseña" />
            <FormErrorMessage>
              Introduce una contraseña
            </FormErrorMessage>
          </FormControl>
          <FormControl isInvalid={!!errors.name}>
            <Input {...register("name", required)} size="lg" autoComplete="off" placeholder="Nombre" />
            <FormErrorMessage>
              Introduce un nombre
            </FormErrorMessage>
          </FormControl>
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
          <GridItem colSpan={3}>
            <HStack spacing={3}>
              <FormControl isInvalid={!!errors.title}>
                <Input {...register("title", required)} size="lg" autoComplete="off" placeholder="Puesto" />
                <FormErrorMessage>
                  Introduce un puesto
                </FormErrorMessage>
              </FormControl>
              <FormControl isInvalid={!!errors.enterpriseId}>
                <Select
                  icon={loading ? <Spinner /> : <ChevronDownIcon />}
                  isDisabled={loading || !!fetchError}
                  size="lg"
                  placeholder="Empresa"
                  textColor="gray.500"
                  {...register("enterpriseId", {...required, valueAsDate: true})}>
                  {
                    !fetchError ?
                      data?.map(({ id, shortName }) => (
                        <option key={id} value={id}>{shortName}</option>
                      )) :
                      <option selected>Error</option>
                  }
                </Select>
                <FormErrorMessage>
                  Selecciona una empresa
                </FormErrorMessage>
              </FormControl>
            </HStack>
          </GridItem>
        </Grid>
        <Button
          type="submit"
          bg="purple.600"
          isDisabled={loading || !!fetchError}
          isLoading={isSubmitting}
          loadingText="Creando usuario"
          leftIcon={<AddIcon />}
          textColor="white">
          Crear
        </Button>
      </form>
    </VStack>
  )
}

export default AddUserView