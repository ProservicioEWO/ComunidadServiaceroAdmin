import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Textarea,
  VStack
} from '@chakra-ui/react';
import { ForwardedRef, forwardRef } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Testimonial } from '../../../models/Testimonial';

export interface TestimonialFormValues {
  name: string
  entity: string
  description: string
}

export interface TestimonialFormProps {
  data: Testimonial
  onSubmit: SubmitHandler<TestimonialFormValues>
}

const TestimonialForm = forwardRef(({ data, onSubmit }: TestimonialFormProps, ref: ForwardedRef<HTMLFormElement>) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<TestimonialFormValues>({
    values: data
  })

  return (
    <form ref={ref} onSubmit={handleSubmit(onSubmit)}>
      <VStack spacing={6}>
        <FormControl variant="floating" isInvalid={!!errors.name}>
          <Input {...register("name", { required: true })} />
          <FormLabel>Nombre</FormLabel>
          <FormErrorMessage>Introduce un nombre</FormErrorMessage>
        </FormControl>
        <FormControl variant="floating" isInvalid={!!errors.entity}>
          <Input {...register("entity", { required: true })} />
          <FormLabel>enitdad</FormLabel>
          <FormErrorMessage>Introduce una entidad</FormErrorMessage>
        </FormControl>
        <FormControl variant="floating" isInvalid={!!errors.description}>
          <Textarea {...register("description", { required: true })} />
          <FormLabel>Descripción</FormLabel>
          <FormErrorMessage>Introduce una descripción</FormErrorMessage>
        </FormControl>
      </VStack>
    </form>
  )
})

export default TestimonialForm