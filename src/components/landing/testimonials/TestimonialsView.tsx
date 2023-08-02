import { AddIcon } from "@chakra-ui/icons"
import { Button, Card, CardBody, Divider, Drawer, DrawerBody, DrawerContent, DrawerFooter, DrawerHeader, DrawerOverlay, HStack, SimpleGrid, Spacer, useBoolean, useDisclosure, VStack } from "@chakra-ui/react"
import { useEffect, useRef } from "react"
import useAppContext from "../../../hooks/useAppContext"
import useAuthContext from "../../../hooks/useAuthContext"
import useCustomToast from "../../../hooks/useCustomToast"
import useInsertData from "../../../hooks/useInsertData"
import { Testimonial } from "../../../models/Testimonial"
import TestimonialCard from "./TestimonialCard"
import TestimonialForm, { TestimonialFormValues } from "./TestimonialForm"

const TestimonialsView = () => {
  const { errorToast, successToast } = useCustomToast()
  const { testimonials, newId } = useAppContext()
  const { authSessionData: { accessToken } } = useAuthContext()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const {
    error: insertError,
    loading: insertLoading,
    insertData
  } = useInsertData<Testimonial>()
  const formRef = useRef<HTMLFormElement | null>(null)

  const confirmSubmit = () => {
    if (formRef.current) {
      const submitEvent = new Event('submit', { bubbles: true, cancelable: true })
      formRef.current.dispatchEvent(submitEvent)
    }
  }

  const handleSubmit = async (values: TestimonialFormValues) => {
    try {
      const newTestimonial = { id: newId, ...values }
      const ok = await insertData("/testimonials", newTestimonial, {
        jwt: accessToken!,
        method: 'PUT'
      })

      if (ok) {
        testimonials.set([newTestimonial, ...(testimonials.list ?? [])])
        successToast("Se agregó el testimonio con éxito")
        onClose()
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    if (insertError) {
      errorToast(insertError)
    }
  }, [insertError])

  useEffect(() => {
    if (testimonials.state.error) {
      errorToast(testimonials.state.error)
    }
  }, [testimonials.state.error])

  return (
    <>
      <VStack align="start">
        <Button
          leftIcon={<AddIcon />}
          onClick={onOpen}>
          Agregar testimonio
        </Button>
        <Divider />
        <SimpleGrid
          columns={2}
          spacing={4}>
          {
            testimonials.list?.map((e, i) => (
              <TestimonialCard
                key={i}
                data={e} />
            ))
          }
        </SimpleGrid>
      </VStack>
      <Drawer
        placement="bottom"
        isOpen={isOpen}
        onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader>
            Creando testimonio
          </DrawerHeader>
          <DrawerBody>
            <TestimonialForm
              ref={formRef}
              onSubmit={handleSubmit} />
          </DrawerBody>
          <DrawerFooter>
            <HStack spacing={2}>
              <Spacer />
              <Button onClick={onClose}>
                Cancelar
              </Button>
              <Button
                isLoading={insertLoading}
                loadingText="Guardando"
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

export default TestimonialsView