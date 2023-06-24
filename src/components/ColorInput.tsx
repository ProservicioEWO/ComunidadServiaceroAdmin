import { Flex, FormLabel, Input } from '@chakra-ui/react';
import { InputChangeEvent } from '../shared/typeAlias';
import { useState, ChangeEventHandler } from 'react';

export interface ColorInputProps {
  value?: string
  onColorChange?: (value: string) => void
}

const ColorInput = ({ value, onColorChange }: ColorInputProps) => {
  const [color, setColor] = useState(value)
  const handleColorChange = (event: InputChangeEvent) => {
    setColor(event.target.value)
    if (onColorChange) {
      onColorChange(event.target.value)
    }
  }
  return (
    <Flex>
      <FormLabel
        htmlFor="color"
        shadow="sm"
        boxSize="2em"
        border="1px"
        borderColor="gray.100"
        borderRadius="full"
        cursor="pointer"
        mb={0}
        bg={color} />
      <Input
        id='color'
        type='color'
        border='none'
        visibility='hidden'
        value={color}
        m={0}
        w={0}
        h={0}
        p={0}
        onChange={handleColorChange} />
    </Flex>
  )
}

export default ColorInput