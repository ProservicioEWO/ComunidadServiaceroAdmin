import { AiOutlineMail, AiOutlinePhone } from 'react-icons/ai';
import {
  Box,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  HStack,
  Icon,
  Input,
  InputGroup,
  InputLeftElement,
  Textarea,
  VStack
} from '@chakra-ui/react';
import { MdInsertLink } from 'react-icons/md';
import { ForwardedRef, forwardRef, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { getSimpleId } from '../../shared/utils';

export interface ExternalFormValues {
  simpleId: string
  name: string
  shortName: string
  description: string
  institution: string
  websiteLink: string
  email: string
  phone: string
  address: string
  cost: string
  advantage: string
  rulesLink: string
  mainLink: string
}

export interface ExternalFormProps {
  init?: ExternalFormValues
  onSubmit: (values: ExternalFormValues) => Promise<void>
  onError: () => void
}

const ExternalForm = forwardRef(({ init, onSubmit, onError }: ExternalFormProps, ref: ForwardedRef<HTMLFormElement>) => {
  const {
    formState: { errors },
    register,
    handleSubmit,
    setValue    
  } = useForm<ExternalFormValues>({
    defaultValues: useMemo(() => init, [init])
  })

  useEffect(() => {
    if (!init) {
      setValue("simpleId", 'PE-' + getSimpleId())
    }
  }, [])


  return (
    <form ref={ref} onSubmit={handleSubmit(onSubmit, onError)}>
      <VStack align='stretch' spacing="4">
        <HStack>
          <HStack>
            <Box>
              <InputGroup>
                <InputLeftElement fontWeight="extrabold" children='Id:' />
                <Input readOnly variant='filled' {...register("simpleId")} />
              </InputGroup>
            </Box>
          </HStack>
        </HStack>
        <HStack>
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
        <HStack align='start'>
          <FormControl variant='floating' isInvalid={!!errors.institution}>
            <Input
              size='lg'
              placeholder=' '
              {...register('institution', { required: true })} />
            <FormLabel>Institución que lo ofrece</FormLabel>
            <FormErrorMessage>Escribe el nombre de la institución</FormErrorMessage>
          </FormControl>
          <FormControl variant='floating-left' isInvalid={!!errors.websiteLink}>
            <InputGroup size='lg'>
              <InputLeftElement pointerEvents='none'>
                <Icon color='gray.400' as={MdInsertLink} />
              </InputLeftElement>
              <Input placeholder=' ' {...register("websiteLink", { required: true })} />
            </InputGroup>
            <FormLabel>Página web</FormLabel>
            <FormErrorMessage>Introduce el link al sitio de la intitución</FormErrorMessage>
          </FormControl>
        </HStack>
        <VStack align='stretch'>
          <Heading size="md">Contacto</Heading>
          <HStack align='start'>
            <FormControl variant='floating-left' isInvalid={!!errors.phone}>
              <InputGroup size='lg'>
                <InputLeftElement pointerEvents='none'>
                  <Icon color='gray.400' as={AiOutlinePhone} />
                </InputLeftElement>
                <Input type='tel' placeholder=' ' {...register("phone", { required: true })} />
              </InputGroup>
              <FormLabel>Teléfono</FormLabel>
              <FormErrorMessage>Escribe el teléfono de la institución</FormErrorMessage>
            </FormControl>
            <FormControl variant='floating-left' isInvalid={!!errors.email}>
              <InputGroup size='lg'>
                <InputLeftElement pointerEvents='none'>
                  <Icon color='gray.400' as={AiOutlineMail} />
                </InputLeftElement>
                <Input type='email' placeholder=' ' {...register("email", { required: true })} />
              </InputGroup>
              <FormLabel>Email</FormLabel>
              <FormErrorMessage>Escribe el email de la institución</FormErrorMessage>
            </FormControl>
          </HStack>
        </VStack>
        <FormControl variant='floating' isInvalid={!!errors.address}>
          <Input
            size='lg'
            placeholder=' '
            {...register('address', { required: true })} />
          <FormLabel>Domicilio</FormLabel>
          <FormErrorMessage>Introduce un domicilio</FormErrorMessage>
        </FormControl>
        <HStack align='start'>
          <FormControl variant='floating' isInvalid={!!errors.cost}>
            <Textarea placeholder=' ' {...register("cost", { required: true })} />
            <FormLabel>Costos</FormLabel>
            <FormErrorMessage>Introduce los costos para el programa</FormErrorMessage>
          </FormControl>
          <FormControl variant='floating' isInvalid={!!errors.advantage}>
            <Textarea placeholder=' ' {...register("advantage", { required: true })} />
            <FormLabel>Beneficios de la Comunidad Seviacero</FormLabel>
            <FormErrorMessage>Introduce los beneficios para el programa</FormErrorMessage>
          </FormControl>
        </HStack>
        <HStack align='start'>
          <FormControl variant='floating' isInvalid={!!errors.rulesLink}>
            <InputGroup size='lg'>
              <InputLeftElement pointerEvents='none'>
                <Icon color='gray.400' as={MdInsertLink} />
              </InputLeftElement>
              <Input placeholder='Políticas' {...register("rulesLink", { required: true })} />
            </InputGroup>
            <FormErrorMessage>Introduce un enlace a las políticas de acceso</FormErrorMessage>
          </FormControl>
          <FormControl variant='floating' isInvalid={!!errors.mainLink}>
            <InputGroup size='lg'>
              <InputLeftElement pointerEvents='none'>
                <Icon color='gray.400' as={MdInsertLink} />
              </InputLeftElement>
              <Input placeholder='Convenio' {...register("mainLink", { required: true })} />
            </InputGroup>
            <FormErrorMessage>Introduce un enlace al convenio</FormErrorMessage>
          </FormControl>
        </HStack>
      </VStack>
    </form >
  )
})

export default ExternalForm

export type ExternalFormType = typeof ExternalForm