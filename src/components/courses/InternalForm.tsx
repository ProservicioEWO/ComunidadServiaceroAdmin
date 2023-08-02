import HTMLEditor from './HTMLEditor';
import {
  Box,
  Divider,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  HStack,
  Icon,
  Input,
  InputGroup,
  InputLeftElement,
  Select,
  Spacer,
  Spinner,
  Switch,
  Textarea,
  VStack
} from '@chakra-ui/react';
import { Controller, useForm } from 'react-hook-form';
import { MdInsertLink } from 'react-icons/md';
import { RefObject, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { LocationParams } from '../locations/LocationDetailView';
import useAppContext from '../../hooks/useAppContext';
import { ChevronDownIcon } from '@chakra-ui/icons';
import ColorInput from '../ColorInput';
import randomColor from 'randomcolor';
import { v4 as uuidv4 } from 'uuid';

export interface InternalFormValues {
  simpleId: string
  name: string
  shortName: string
  description: string
  auto: boolean
  cost: string
  advantage: string
  date: string
  end: string
  locationId: string
  duration: string
  schedule: string
  mainLink: string
  rulesLink: string
  plan: string
  req: string
  color: string
}

export interface InternalFormProps {
  formRef: RefObject<HTMLFormElement>
  onSubmit: (values: InternalFormValues) => Promise<void>
  onError: () => void
}

const InternalForm = ({ formRef, onSubmit, onError }: InternalFormProps) => {
  const [idValue, setIdValue] = useState("")
  const { cityId } = useParams<LocationParams>()
  const { locations } = useAppContext()
  const { control, formState: { errors }, register, handleSubmit } = useForm<InternalFormValues>()

  useEffect(() => {
    const currentDate = new Date()
    const time = String(currentDate.getTime())
    const numeric = time.slice(time.length - 5, time.length - 1)
    const unique = uuidv4().slice(0, 4)
    setIdValue('PI-' + numeric + unique)
  }, [])

  useEffect(() => {
    locations.fetch(cityId)
  }, [cityId])

  return (
    <form ref={formRef} onSubmit={handleSubmit(onSubmit, onError)}>
      <VStack align='stretch' spacing={4}>
        <HStack>
          <HStack>
            <Box>
              <InputGroup>
                <InputLeftElement children='Id:' />
                <Input readOnly variant='filled' value={idValue} {...register("simpleId")} />
              </InputGroup>
            </Box>
            <Box>
              <Box>
                <Controller
                  name='color'
                  control={control}
                  render={({ field: { onChange } }) => (
                    <ColorInput
                      value={randomColor()}
                      onColorChange={onChange} />
                  )} />
              </Box>
            </Box>
          </HStack>
          <Spacer />
          <Box>
            <FormControl display="flex" alignItems="center">
              <FormLabel htmlFor="is-auto">
                Ocultar automáticamente
              </FormLabel>
              <Switch {...register("auto")} id="is-auto" />
            </FormControl>
          </Box>
        </HStack>
        <HStack align='start'>
          <FormControl variant='floating' isInvalid={!!errors.name}>
            <Input
              size='lg'
              placeholder=' '
              {...register('name', { required: true })} />
            <FormLabel>Nombre</FormLabel>
            <FormErrorMessage>Escribe un nombre para el programa</FormErrorMessage>
          </FormControl>
          <FormControl variant='floating' isInvalid={!!errors.shortName}>
            <Input
              size='lg'
              placeholder=' '
              {...register('shortName', { required: true })} />
            <FormLabel>Nombre corto</FormLabel>
            <FormErrorMessage>Escribe un nombre corto para el programa</FormErrorMessage>
          </FormControl>
        </HStack>
        <FormControl variant='floating' isInvalid={!!errors.description}>
          <Input
            size='lg'
            placeholder=' '
            {...register('description', { required: true })} />
          <FormLabel>Descripción</FormLabel>
          <FormErrorMessage>Escribe una descripción para el programa</FormErrorMessage>
        </FormControl>
        <Divider />
        <VStack align='stretch'>
          <Heading size="md">Plan curricular</Heading>
          <Controller
            name='plan'
            control={control}
            rules={{ required: true }}
            render={({ field: { onChange } }) => (
              <HTMLEditor
                isInvalid={!!errors.plan}
                errorMessage='Introduce un contenido para el plan curricular del programa'
                onChange={onChange} />
            )} />
        </VStack>
        <Divider />
        <VStack align='stretch'>
          <Heading size="md">Requisitos del programa</Heading>
          <Controller
            name='req'
            control={control}
            rules={{ required: true }}
            render={({ field: { onChange } }) => (
              <HTMLEditor
                isInvalid={!!errors.plan}
                errorMessage='Introduce los requisitos del programa'
                onChange={onChange} />
            )} />
        </VStack>
        <Divider />
        <HStack align='start'>
          <FormControl variant='floating' isInvalid={!!errors.cost}>
            <Textarea placeholder=' ' {...register("cost", { required: true })} />
            <FormLabel>Costo de programa</FormLabel>
            <FormErrorMessage>Introduce el costo para el programa</FormErrorMessage>
          </FormControl>
          <FormControl variant='floating' isInvalid={!!errors.advantage}>
            <Textarea placeholder=' ' {...register("advantage", { required: true })} />
            <FormLabel>Apoyo</FormLabel>
            <FormErrorMessage>Introduce el apoyo para el programa</FormErrorMessage>
          </FormControl>
        </HStack>
        <HStack align='start'>
          <FormControl variant='floating' isInvalid={!!errors.date}>
            <Input type='date' size='lg' placeholder=' ' {...register("date", { required: true })} />
            <FormLabel>Inicio</FormLabel>
            <FormErrorMessage>Indica una fecha de inicio</FormErrorMessage>
          </FormControl>
          <FormControl variant='floating' isInvalid={!!errors.date}>
            <Input type='date' size='lg' placeholder=' ' {...register("end", { required: true })} />
            <FormLabel>Fin</FormLabel>
            <FormErrorMessage>Indica una fecha de fin</FormErrorMessage>
          </FormControl>
          <FormControl variant='floating' isInvalid={!!errors.locationId}>
            <Select
              size='lg'
              placeholder='--'
              isDisabled={locations.state.loading}
              icon={locations.state.loading ? <Spinner /> : <ChevronDownIcon />}
              {...register("locationId", { required: true })}>
              {
                locations.list?.map(({ id, name }, i) => (
                  <option key={i} value={id}>{name}</option>
                ))
              }
            </Select>
            <FormLabel>Ubicación</FormLabel>
            <FormErrorMessage>Selecciona una ubicación</FormErrorMessage>
          </FormControl>
          <FormControl variant='floating' isInvalid={!!errors.schedule}>
            <Input type='time' size='lg' placeholder=' ' {...register("schedule", { required: true })} />
            <FormLabel>Horario</FormLabel>
            <FormErrorMessage>Indica un horario</FormErrorMessage>
          </FormControl>
        </HStack>
        <FormControl variant='floating' isInvalid={!!errors.duration}>
          <Input size='lg' placeholder=' ' {...register("duration", { required: true })} />
          <FormLabel>Duración</FormLabel>
          <FormErrorMessage>Indica una duración</FormErrorMessage>
        </FormControl>
        <Divider />
        <HStack align='start'>
          <FormControl variant='floating' isInvalid={!!errors.mainLink}>
            <InputGroup size='lg'>
              <InputLeftElement pointerEvents='none'>
                <Icon color='gray.400' as={MdInsertLink} />
              </InputLeftElement>
              <Input placeholder='Inscripción' {...register("mainLink", { required: true })} />
            </InputGroup>
            <FormErrorMessage>Introduce un enlace de inscripción</FormErrorMessage>
          </FormControl>
          <FormControl variant='floating' isInvalid={!!errors.rulesLink}>
            <InputGroup size='lg'>
              <InputLeftElement pointerEvents='none'>
                <Icon color='gray.400' as={MdInsertLink} />
              </InputLeftElement>
              <Input placeholder='Políticas' {...register("rulesLink", { required: true })} />
            </InputGroup>
            <FormErrorMessage>Introduce un enlace a las políticas</FormErrorMessage>
          </FormControl>
        </HStack>
      </VStack>
    </form>
  )
}

export default InternalForm

export type InternalFormType = typeof InternalForm