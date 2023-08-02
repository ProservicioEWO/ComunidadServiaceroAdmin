import DropzoneComponent from './DropzoneComponent';
import { AddIcon } from '@chakra-ui/icons';
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  HStack,
  Input,
  Text,
  useDisclosure,
  VStack
} from '@chakra-ui/react';
import { BiImageAlt } from 'react-icons/bi';
import { Controller, useForm } from 'react-hook-form';
import { useEffect, useRef } from 'react';

export interface AddLocationFormValues {
  id: string
  name: string,
  file: FileList
}

export interface AddLocationMenuProps {
  nextId: string
  loading: boolean
  isDisabled?: boolean
  onAdd: (values: AddLocationFormValues) => Promise<void>
}

const AddLocationMenu = ({ nextId, loading, onAdd, isDisabled = false }: AddLocationMenuProps) => {
  const {
    control,
    formState: { errors },
    handleSubmit,
    register,
    reset
  } = useForm<AddLocationFormValues>()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const cancelRef = useRef(null)
  const formRef = useRef<HTMLFormElement>(null)

  const handleClick = () => {
    formRef.current?.dispatchEvent(new Event("submit", {
      cancelable: true,
      bubbles: true
    }))
  }

  const handleOnAdd = async (values: AddLocationFormValues) => {
    await onAdd(values)
    onClose()
  }

  useEffect(() => {
    reset({
      id: nextId
    })
  }, [nextId])

  return (
    <>
      <Flex>
        <Button
          isDisabled={isDisabled}
          onClick={onOpen}
          leftIcon={
            <AddIcon />
          }>
          <Text>
            Agregar instalación
          </Text>
        </Button>
      </Flex>
      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}>
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize='lg' fontWeight='bold' bg='purple.500' textColor='white' shadow='md'>
              Configuración de instalación
            </AlertDialogHeader>
            <AlertDialogBody>
              <form ref={formRef} onSubmit={handleSubmit(handleOnAdd)}>
                <VStack align='stretch'>
                  <HStack>
                    <Text fontSize='sm' fontWeight='bold'>Id:</Text>
                    <Input readOnly variant='unstyled' textColor="gray.400" {...register("id")} />
                  </HStack>
                  <FormControl>
                    <Input
                      placeholder='Nombre'
                      size='lg'
                      isInvalid={!!errors.name}
                      {...register("name", { required: true })} />
                    <FormErrorMessage>
                      El nombre de la intalación es requerido"
                    </FormErrorMessage>
                  </FormControl>
                  <Controller
                    name="file"
                    control={control}
                    render={({ field }) => (
                      <DropzoneComponent
                        placeholder='Subir imagen'
                        icon={BiImageAlt}
                        maxFiles={1}
                        multiple={false}
                        accept={{
                          'image/jpeg': ['.jpeg', '.jpg'],
                          'image/png': ['.png']
                        }}
                        onDrop={field.onChange} />
                    )} />
                </VStack>
              </form>
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button
                ref={cancelRef}
                onClick={() => {
                  onClose()
                  reset()
                }}>
                Cancelar
              </Button>
              <Button
                isLoading={loading}
                loadingText="Guardando"
                colorScheme='purple'
                onClick={handleClick}
                ml={3}>
                Guardar
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  )
}

export default AddLocationMenu