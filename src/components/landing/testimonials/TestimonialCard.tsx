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
import { DeleteIcon, EditIcon } from '@chakra-ui/icons';
import { Testimonial } from '../../../models/Testimonial';
import TestimonialEditForm, { TestimonialFormValues } from './TestimonialForm';
import { useRef } from 'react';
import useInsertData from '../../../hooks/useInsertData';
import useAuthContext from '../../../hooks/useAuthContext';

export interface TestimonialCardProps {
  data: Testimonial
}

const TestimonialCard = ({ data }: TestimonialCardProps) => {
  const { authSessionData: { accessToken } } = useAuthContext()
  const [isSubmitting, setIsSubmitting] = useBoolean(false)
  const { isOpen, onOpen, onClose } = useDisclosure()
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
  }

  const handleSubmit = async (values: TestimonialFormValues) => {

  }

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
            <TestimonialEditForm
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