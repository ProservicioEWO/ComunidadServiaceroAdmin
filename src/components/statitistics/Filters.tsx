import useAppContext from '../../hooks/useAppContext';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  HStack,
  Input,
  Spacer,
  Text,
  VStack
} from '@chakra-ui/react';
import { FormDatesValue } from '../../pages/Statitistics';
import { StatsParams } from './StatitisticsDetails';
import { useForm } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import { formatDateString } from '../../shared/utils';

const Filters = () => {
  const { modules, logs } = useAppContext()
  const { moduleId } = useParams<StatsParams>()
  const {
    handleSubmit,
    register,
    formState: { errors }
  } = useForm<FormDatesValue>()

  const applyFilter = (start: string, end: string) => {
    modules.applyFilter(({ date }) => (
      new Date(date) >= new Date(start) &&
      new Date(date) <= new Date(end)
    ))
  }

  const onSubmit = ({ start, end }: FormDatesValue) => {
    const newStart = formatDateString(start)
    const newEnd = formatDateString(end)
    applyFilter(newStart, newEnd)
    logs.fetch({ moduleId, type: 'M' })
    logs.filters.set({
      moduleId,
      dateStart: newStart,
      dateEnd: newEnd
    })
  }

  return (
    <HStack alignItems='end' spacing={4}>
      <Spacer />
      <form onSubmit={handleSubmit(onSubmit)}>
        <VStack align='start'>
          <HStack>
            <Box>
              <FormControl bg='white' variant='floating-date' isInvalid={!!errors.start}>
                <FormLabel>Inicio:</FormLabel>
                <Input
                  {...register("start", { required: true, valueAsDate: true })}
                  type='date' />
              </FormControl>
            </Box>
            <Box>
              <FormControl bg='white' variant='floating-date' isInvalid={!!errors.end}>
                <FormLabel>Fin:</FormLabel>
                <Input
                  {...register("end", { required: true, valueAsDate: true })}
                  type='date' />
              </FormControl>
            </Box>
            <Button type='submit'>Consultar</Button>
          </HStack>
          {
            (!!errors.start || !!errors.end) &&
            <Text color="red.500">
              Introduce un rango de fechas
            </Text>
          }
        </VStack>
      </form>
    </HStack>
  )
}

export default Filters