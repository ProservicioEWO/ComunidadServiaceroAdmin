import Dropzone from 'react-dropzone';
import useCustomToast from '../../hooks/useCustomToast';
import useInsertData from '../../hooks/useInsertData';
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
  Input,
  Text,
  useDisclosure,
  VStack
} from '@chakra-ui/react';
import { Location } from '../../models/Location';
import { useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';

export interface AddLocationFormValues {
  id: string
  name: string,
  file: FileList
}

export interface AddLocationMenuProps {
  nextId: string
  cityId: string
  isDisabled?: boolean
  toData: Location[] | null
}

const AddLocationMenu = ({ nextId, cityId, toData, isDisabled = false }: AddLocationMenuProps) => {
  const { errorToast, successToast } = useCustomToast()
  const {
    error,
    loading,
    insertData
  } = useInsertData<Location>()
  const {
    handleSubmit,
    register,
    reset,
    formState: { errors }
  } = useForm<AddLocationFormValues>()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const cancelRef = useRef(null)
  const formRef = useRef<HTMLFormElement>(null)
  const handleAddLocation = async ({ name, id }: AddLocationFormValues) => {
    if (toData) {
      const newLoc = { id, name, cityId: cityId ?? "" }
      const ok = await insertData("/locations", newLoc)
      if (ok) {
        successToast("Se agregó la nueva instalación con éxito")
        onClose()
      }
    }
  }
  const handleClick = () => {
    formRef.current?.dispatchEvent(new Event("submit", {
      cancelable: true,
      bubbles: true
    }))
  }

  useEffect(() => {
    if (error) {
      errorToast("Ocurrió un error insertando la instalación. Por favor, inténtalo más tarde.")
    }

    reset({
      id: nextId
    })
  }, [nextId, error])

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
              <form ref={formRef} onSubmit={handleSubmit(handleAddLocation)}>
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