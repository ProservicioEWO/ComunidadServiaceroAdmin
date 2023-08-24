import { AddIcon } from '@chakra-ui/icons';
import {
  Button,
  Flex,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text
} from '@chakra-ui/react';

export interface AddCourseMenuProps {
  isDisabled?: boolean
  onClick: (type: 'interno' | 'externo') => void
}

const AddCourseMenu = ({ onClick, isDisabled = false }: AddCourseMenuProps) => {
  return (
    <Flex>
      <Menu>
        <MenuButton
          as={Button}
          isDisabled={isDisabled}
          leftIcon={<AddIcon />}>
          <Text>
            Agregar curso
          </Text>
        </MenuButton>
        <MenuList>
          <MenuItem onClick={() => onClick('interno')}>Interno</MenuItem>
          <MenuItem onClick={() => onClick('externo')}>Externo</MenuItem>
        </MenuList>
      </Menu>
    </Flex>
  )
}

export default AddCourseMenu