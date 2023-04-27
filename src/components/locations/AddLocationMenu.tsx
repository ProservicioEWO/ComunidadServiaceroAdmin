import { AddIcon, DownloadIcon } from '@chakra-ui/icons';
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
  Input, Text,
  useDisclosure,
  VStack
} from '@chakra-ui/react';
import { useRef } from 'react';
import Dropzone from 'react-dropzone';
import { useForm } from 'react-hook-form';

export interface AddLocationFormValues {
  id: number
  name: string,
  file: FileList
}

export interface AddLocationMenuProps {
  nextId: number
}

const AddLocationMenu = ({ nextId }: AddLocationMenuProps) => {
  const { handleSubmit, register, reset, formState: { errors, isSubmitting } } = useForm<AddLocationFormValues>({
    defaultValues:{
      id: nextId
    }
  })
  const { isOpen, onOpen, onClose } = useDisclosure()
  const cancelRef = useRef(null)
  const formRef = useRef<HTMLFormElement>(null)
  const handleAddLocation = (data: AddLocationFormValues) => {
    console.log(data)
  }
  const handleClick = () => {
    formRef.current?.dispatchEvent(new Event("submit", { cancelable: true, bubbles: true }))
  }
  return (
    <>
      <Flex>
        <Button
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
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize='lg' fontWeight='bold'>
              Configuración de instalación
            </AlertDialogHeader>
            <AlertDialogBody>
              <form ref={formRef} onSubmit={handleSubmit(handleAddLocation)}>
                <VStack align='stretch'>
                  <HStack>
                    <Text fontSize='sm'>Id</Text>
                    <Input type='number' readOnly variant='unstyled' {...register("id", { valueAsNumber: true })} />
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
                  <Dropzone onDrop={acceptedFiles => console.log(acceptedFiles)}>
                    {
                      ({ getRootProps, getInputProps }) => (
                        <Flex
                          justify='center'
                          border='2px dashed'
                          borderColor={errors.file ? 'red.500' : 'gray.300'}
                          borderRadius='md'
                          px={3}
                          py={8}>
                          <div {...getRootProps()}>
                            <input {...getInputProps()} {...register("file")} />
                            <VStack>
                              <DownloadIcon fontSize='2xl' transform='rotate(180deg)' />
                              <Text>Subir imagen</Text>
                            </VStack>
                          </div>
                        </Flex>
                      )
                    }
                  </Dropzone>
                </VStack>
              </form>
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={() => {
                onClose()
                reset()
              }}>
                Cancelar
              </Button>
              <Button
                isLoading={isSubmitting}
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