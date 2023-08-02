import { DeleteIcon, EditIcon } from '@chakra-ui/icons';
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  Heading,
  HStack,
  Spacer,
  Text,
  useBoolean,
  useDisclosure
} from '@chakra-ui/react';
import { useEffect, useRef } from 'react';
import useAppContext from '../../../hooks/useAppContext';
import useAuthContext from '../../../hooks/useAuthContext';
import useCustomToast from '../../../hooks/useCustomToast';
import useDeleteData from '../../../hooks/useDelete';
import useInsertData from '../../../hooks/useInsertData';
import { Testimonial } from '../../../models/Testimonial';
import TestimonialForm, { TestimonialFormValues } from './TestimonialForm';

export interface TestimonialCardProps {
  data: Testimonial
}

const TestimonialCard = ({ data }: TestimonialCardProps) => {
  const { successToast, errorToast } = useCustomToast()
  const { authSessionData: { accessToken } } = useAuthContext()
  const { testimonials } = useAppContext()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const {
    error: deleteError,
    loading: deleteLoading,
    deleteData
  } = useDeleteData()
  const {
    error: insertError,
    loading: insertLoading,
    insertData
  } = useInsertData()
  const btnRef = useRef<HTMLButtonElement | null>(null)
  const formRef = useRef<HTMLFormElement | null>(null)

  const confirmSubmit = () => {
    if (formRef.current) {
      const submitEvent = new Event('submit', { bubbles: true, cancelable: true })
      formRef.current.dispatchEvent(submitEvent)
    }
  }

  const handleDelete = async () => {
    try {
      const ok = await deleteData("/testimonials", data.id, {
        jwt: accessToken!
      })

      if (ok) {
        const newTestimonialsList = testimonials.list?.filter(e => e.id !== data.id)
        testimonials.set(newTestimonialsList ?? [])
      }
    } catch (error) {
      console.log(error)
    }
  }

  const handleSubmit = async (values: TestimonialFormValues) => {
    try {
      const newTestimonial = { id: data.id, ...values }
      const ok = await insertData("/testimonials", newTestimonial, {
        jwt: accessToken!,
        method: 'PUT'
      })

      if (ok) {
        testimonials.set([newTestimonial, ...(testimonials.list ?? [])])
        successToast("Se modificó el testimonio con éxito")
        onClose()
      }
    } catch (error) {
      const err = error as Error
      console.log(err.message)
    }
  }

  useEffect(() => {
    if (insertError) {
      errorToast(insertError)
    }
  }, [insertError])

  useEffect(() => {
    if (deleteError) {
      errorToast(deleteError)
    }
  }, [deleteError])

  return (
    <>
      <Card
        borderWidth="1px"
        borderColor="gray.100"
        bg="gray.50">
        <CardHeader>
          <Heading>
            {data.name}
          </Heading>
          <Text>{data.entity}</Text>
        </CardHeader>
        <CardBody>
          {data.description}
        </CardBody>
        <CardFooter>
          <HStack
            w="full"
            spacing={2}>
            <Spacer />
            <Button
              onClick={handleDelete}
              loadingText="Borrando"
              isLoading={deleteLoading}
              colorScheme="red"
              leftIcon={<DeleteIcon />}>
              Borrar
            </Button>
            <Button
              ref={btnRef}
              onClick={onOpen}
              colorScheme="purple"
              leftIcon={<EditIcon />}>
              Editar
            </Button>
          </HStack>
        </CardFooter>
      </Card>
      <Drawer placement="bottom" isOpen={isOpen} onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader>
            Editando testimonio
          </DrawerHeader>
          <DrawerBody>
            <TestimonialForm
              ref={formRef}
              data={data}
              onSubmit={handleSubmit} />
          </DrawerBody>
          <DrawerFooter>
            <HStack spacing={2}>
              <Spacer />
              <Button onClick={onClose}>
                Cancelar
              </Button>
              <Button
                colorScheme="purple"
                isLoading={insertLoading}
                loadingText="Guardando"
                type="submit"
                onClick={confirmSubmit}>
                Guardar
              </Button>
            </HStack>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  )
}

export default TestimonialCard