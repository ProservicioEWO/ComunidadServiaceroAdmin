import useCustomToast from '../../hooks/useCustomToast';
import useFetch from '../../hooks/useFetch';
import useUpdateData from '../../hooks/useUpdateData';
import { ChevronDownIcon } from '@chakra-ui/icons';
import {
  Dispatch,
  RefObject,
  SetStateAction,
  useEffect,
  useMemo,
  useState
} from 'react';
import { EditUserData } from './UserDetailView';
import { Enterprise } from '../../models/Enterprise';
import {
  FormControl,
  FormErrorMessage,
  Grid,
  GridItem,
  HStack,
  Input,
  Select,
  Spinner,
  Text
} from '@chakra-ui/react';
import { InputChangeEvent } from '../../shared/typeAlias';
import { useForm } from 'react-hook-form';

export interface UserEditFormProps {
  formRef: RefObject<HTMLFormElement>
  data: EditUserData
  user: string
  userId?: string,
  setIsLoading: Dispatch<SetStateAction<boolean>>,
  onSuccess: (newValues: EditUserData) => void
}

const UserEditForm = ({ formRef, data, user, userId, setIsLoading, onSuccess }: UserEditFormProps) => {
  const { errorToast } = useCustomToast()
  const [entities, setEntitites] = useState<string[]>([])
  const {
    data: fetchData,
    loading: fetchLoading,
    error: fetchError,
    fetchData: fetchEnt
  } = useFetch<Enterprise[]>()
  const required = useMemo(() => ({ required: true }), [])
  const { handleSubmit, register, formState: { errors, isSubmitting }, reset } = useForm<EditUserData>()
  const {
    updateData,
    error: updateError
  } = useUpdateData<EditUserData>()
  const setEntititesByEntId = (_id: number) => {
    const ent = fetchData?.find(({ id }) => id === _id)
    setEntitites(ent?.entities ?? [])
  }
  const onSubmit = async (values: EditUserData) => {
    if (userId) {
      const ok = await updateData("/users/:id", { id: userId }, values)
      if (ok) {
        onSuccess(values)
      }
    }
  }
  const handleSelectChange = ({ target: { value } }: InputChangeEvent) => {
    setEntititesByEntId(Number(value))
  }

  useEffect(() => {
    fetchEnt("/enterprises")
  }, [])

  useEffect(() => {
    setIsLoading(isSubmitting)
  }, [isSubmitting])

  useEffect(() => {
    reset(data)
    setEntititesByEntId(data.enterpriseId)
    if (updateError) {
      errorToast(updateError)
    }
    if (fetchError) {
      errorToast(fetchError)
    }
  }, [fetchError, updateError, fetchLoading])

  return (
    fetchLoading ?
      <HStack>
        <Spinner />
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
          <FormControl isInvalid={!!errors.type}>
            <Select {...register("type", required)} size="lg" autoComplete="off" placeholder="Tipo">
              {
                ["Q", "S"].map((e, i) => (
                  <option key={i} value={e}>{e}</option>
                ))
              }
            </Select>
            <FormErrorMessage>
              Introduce un tipo
            </FormErrorMessage>
          </FormControl>
          <FormControl isInvalid={!!errors.enterpriseId}>
            <Select
              icon={fetchLoading ? <Spinner /> : <ChevronDownIcon />}
              isDisabled={fetchLoading || !!fetchError}
              size="lg"
              placeholder="Empresa"
              {...register("enterpriseId", { ...required, valueAsNumber: true })}
              onChange={handleSelectChange}>
              {
                !fetchError ?
                  fetchData?.map(({ id, shortname }) => (
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
        </Grid>
      </form>
  )
}

export default UserEditForm