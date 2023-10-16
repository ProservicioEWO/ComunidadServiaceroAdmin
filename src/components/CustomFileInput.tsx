import { AddIcon } from '@chakra-ui/icons'
import { Input, Button, FormControl, HStack, Icon, Text } from '@chakra-ui/react'
import { ChangeEvent, FC } from 'react'
import { SVGComponent } from '../shared/typeAlias'

interface CustomFileInputProps {
  text: string
  icon: SVGComponent
  isDisabled?: boolean
  onChange: (file: FileList) => void
}

const CustomFileInput = ({ text, icon, onChange, isDisabled = false }: CustomFileInputProps) => {
  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files) {
      onChange(files)
    }
  }

  return (
    <FormControl>
      <Input id='file-input' type="file" onChange={handleInputChange} display="none" multiple />
      <Button as="label" htmlFor="file-input" role='button' isDisabled={isDisabled}>
        <HStack>
          <Icon as={icon} />
          <Text>{text}</Text>
        </HStack>
      </Button>
    </FormControl>
  )
}

export default CustomFileInput