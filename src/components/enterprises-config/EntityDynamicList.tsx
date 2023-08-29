import { AddIcon, CheckIcon, CloseIcon } from '@chakra-ui/icons';
import {
  Button,
  ButtonGroup,
  Fade,
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
  emptyMessage: string
  onAcept: (value: string) => void
}

const EntityDynamicList = ({ data, emptyMessage, onAcept }: EntityDynamicListProps) => {
  const [isAdd, setIsAdd] = useBoolean(false)
  const [newValue, setNewValue] = useState<string>("")

  const handleAdd = () => {
    setIsAdd.on()
  }

  const handleAcept = () => {
    setIsAdd.off()
    onAcept(newValue)
  }

  const handleCancel = () => {
    setIsAdd.off()
  }

  return (
    <VStack align="stretch">
      {
        !!data.length ?
          <VStack align="stretch" spacing={0} overflowY="auto" maxH="xs">
            {
              data.map(
                (e, i) => (
                  <HStack key={i} p={2} align="center" borderBottom={i < data.length - 1 ? "1px solid #dedede" : "none"} >
                    <Text>{e}</Text>
                  </HStack>
                )
              )
            }
          </VStack> :
          <Text>{emptyMessage}</Text>
      }
      <SlideFade in={isAdd}>
        <HStack>
          <Input value={newValue} onChange={({ target: { value } }) => setNewValue(value)} placeholder='nombre entidad' />
          <ButtonGroup size="sm" isAttached>
            <IconButton icon={<Icon as={CloseIcon} />} colorScheme="red" onClick={handleCancel} aria-label='cancel' />
            <IconButton icon={<Icon as={CheckIcon} />} colorScheme="green" onClick={handleAcept} aria-label='acept' />
          </ButtonGroup>
        </HStack>
      </SlideFade>
      <Spacer />
      <Button isDisabled={isAdd} leftIcon={<Icon as={AddIcon} />} onClick={handleAdd}>Nuevo</Button>
    </VStack>
  )
}

export default EntityDynamicList