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
  onClick: {
    internal: () => void,
    external: () => void
  }
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
          <MenuItem onClick={onClick.internal}>Interno</MenuItem>
          <MenuItem onClick={onClick.external}>Externo</MenuItem>
        </MenuList>
      </Menu>
    </Flex>
  )
}

export default AddCourseMenu