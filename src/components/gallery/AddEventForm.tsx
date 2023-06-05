import { AddIcon, CheckIcon } from '@chakra-ui/icons';
import {
  Box,
  FocusLock,
  FormControl,
  Icon,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  ListItem,
  Popover,
  PopoverArrow,
  PopoverContent,
  PopoverTrigger,
  Tooltip,
  UnorderedList,
  useBoolean,
  useDisclosure
} from '@chakra-ui/react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

export interface NewEventValue {
  name: string
}

export interface AddEventFormProps {
  isLoading: boolean
  onAdd: (element: NewEventValue) => Promise<void>
}

const AddEventForm = ({ onAdd, isLoading }: AddEventFormProps) => {
  const { isOpen, onToggle, onClose } = useDisclosure()
  const { reset, register, handleSubmit, formState: { errors } } = useForm<NewEventValue>()
  const onSubmit = async (data: NewEventValue) => {
    await onAdd(data)
    reset()
    onClose()
  }
  return (
    <Popover isLazy isOpen={isOpen} onClose={onClose}>
      <PopoverTrigger>
        <Box>
          <Tooltip hasArrow placement='right' label="Agregar evento">
            <IconButton
              onClick={onToggle}
              size="sm"
              variant='outline'
              borderColor='gray.400'
              aria-label='add location'
              icon={<Icon color='gray.400' as={AddIcon} />} />
          </Tooltip>
        </Box>
      </PopoverTrigger>
      <PopoverContent>
        <FocusLock>
          <PopoverArrow />
          <Tooltip
            rounded='md'
            bg="red.400"
            isOpen={!!errors.name}
            hasArrow label={
              <UnorderedList>
                <ListItem>Los campos no pueden quedar vacios</ListItem>
                <ListItem>El alias debe de ser tres letras mayusculas</ListItem>
              </UnorderedList>
            }>
            <form onSubmit={handleSubmit(onSubmit)}>
              <InputGroup variant='flushed'>
                <FormControl isInvalid={!!errors.name}>
                  <Input
                    _focus={{ bg: "gray.50" }}
                    autoComplete='off'
                    focusBorderColor='transparent'
                    border='none'
                    {...register("name", { required: true })}
                    placeholder='Nombre' />
                </FormControl>
                <InputRightElement>
                  <IconButton
                    isLoading={isLoading}
                    type='submit'
                    size='sm'
                    colorScheme='green'
                    icon={<Icon as={CheckIcon} />}
                    aria-label='add element' />
                </InputRightElement>
              </InputGroup>
            </form>
          </Tooltip>
        </FocusLock>
      </PopoverContent>
    </Popover>
  )
}

export default AddEventForm