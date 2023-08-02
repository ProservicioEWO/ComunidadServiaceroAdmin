import { AddIcon } from "@chakra-ui/icons"
import { Button, Card, CardBody, Divider, SimpleGrid, VStack } from "@chakra-ui/react"
import { useEffect } from "react"
import useAppContext from "../../../hooks/useAppContext"
import useCustomToast from "../../../hooks/useCustomToast"
import TestimonialCard from "./TestimonialCard"

const TestimonialsView = () => {
  const { errorToast } = useCustomToast()
  const { testimonials } = useAppContext()

  useEffect(() => {
    if (testimonials.state.error) {
      errorToast(testimonials.state.error)
    }
  }, [testimonials.state.error])

  return (
    <VStack align="start">
      <Button leftIcon={<AddIcon/>}>
        Agregar testimonio
      </Button>
      <Divider/>
      <SimpleGrid columns={2} spacing={4}>
        {
          testimonials.list?.map(e => <TestimonialCard data={e} />)
        }
      </SimpleGrid>
    </VStack>
  )
}

export default TestimonialsView