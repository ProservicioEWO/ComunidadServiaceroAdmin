import { AddIcon, CheckIcon, CloseIcon, DeleteIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  ButtonGroup,
  HStack,
  Icon,
  IconButton,
  Input,
  SlideFade,
  Spacer,
  Text,
  useBoolean,
  VStack
} from '@chakra-ui/react';
import { useState } from 'react';

export interface EntityDynamicListProps {
  data: string[]
  isLoading: boolean
  emptyMessage: string
  onAccept: (value: string) => Promise<void>
  onDelete: (id: number) => Promise<void>
}

const EntityDynamicList = ({ data, emptyMessage, isLoading, onAccept, onDelete }: EntityDynamicListProps) => {
  const [isAdd, setIsAdd] = useBoolean(false)
  const [newValue, setNewValue] = useState<string>("")
  const [currentHovered, setCurrentHovered] = useState<number>()

  const handleAdd = () => {
    setIsAdd.on()
  }

  const handleAccept = async () => {
    await onAccept(newValue)
    //setIsAdd.off()
    setNewValue("")
  }

  const handleCancel = () => {
    setIsAdd.off()
    setNewValue("")
  }

  return (
    <VStack align="stretch">
      {
        !!data.length ?
          <VStack align="stretch" spacing={0} overflowY="auto" maxH="xs">
            {
              data.map(
                (e, i) => (
                  <HStack
                    cursor='default'
                    key={i}
                    p={2} align="center"
                    borderBottom={i < data.length - 1 ? "1px solid #dedede" : "none"}
                    onMouseEnter={() => setCurrentHovered(i)}
                    onMouseLeave={() => setCurrentHovered(undefined)}>
                    <Text>{e}</Text>
                    <Spacer />
                    {
                      <Box overflow='hidden'>
                        <SlideFade in={currentHovered !== undefined && currentHovered === i} offsetX={20} offsetY={0}>
                          <IconButton
                            variant='unstyled'
                            color='red.500'
                            icon={<Icon as={DeleteIcon} />}
                            aria-label={'delete item'}
                            onClick={async () => await onDelete(i)} />
                        </SlideFade>
                      </Box>
                    }
                  </HStack>
                )
              )
            }
          </VStack> :
          <Text>{emptyMessage}</Text>
      }
      <SlideFade in={isAdd}>
        <HStack>
          <Input
            isDisabled={isLoading}
            value={newValue}            
            onChange={({ target: { value } }) => setNewValue(value)}
            placeholder='nombre entidad' 
            />
          <ButtonGroup size="sm" isAttached>
            <IconButton
              isDisabled={isLoading}
              icon={<Icon as={CloseIcon} />}
              colorScheme="red"
              onClick={handleCancel}
              aria-label='cancel' />
            <IconButton
              isDisabled={newValue === "" }
              icon={<Icon as={CheckIcon} />}
              colorScheme="green"
              onClick={handleAccept} aria-label='acept' />
          </ButtonGroup>
        </HStack>
      </SlideFade>
      <Spacer />
      <Button isDisabled={isAdd} leftIcon={<Icon as={AddIcon} />} onClick={handleAdd}>Nuevo</Button>
    </VStack>
  )
}

export default EntityDynamicList