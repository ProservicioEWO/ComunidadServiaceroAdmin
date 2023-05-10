import useCustomToast from '../../hooks/useCustomToast';
import useInsertData from '../../hooks/useInsertData';
import { AddIcon } from '@chakra-ui/icons';
import { AddLocationFormValues } from './AddLocationMenu';
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  Flex,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  useDisclosure
} from '@chakra-ui/react';
import { Course } from '../../models/Course';
import { useForm } from 'react-hook-form';
import { useRef } from 'react';

export interface AddCourseMenuProps {
  isDisabled?: boolean
}

const AddCourseMenu = ({ isDisabled = false }: AddCourseMenuProps) => {
  const {
    error,
    loading,
    insertData
  } = useInsertData<Course>()
  const {
    handleSubmit,
    register,
    reset,
    formState: { errors }
  } = useForm<AddLocationFormValues>()
  const { errorToast, successToast } = useCustomToast()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const cancelRef = useRef(null)
  const formRef = useRef<HTMLFormElement>(null)

  const handleAddLocation = async () => {

  }
  const handleClick = () => {
    formRef.current?.dispatchEvent(new Event("submit", {
      cancelable: true,
      bubbles: true
    }))
  }

  return (
    <Flex>
      <Menu>
        <MenuButton
          as={Button}
          isDisabled={isDisabled}
          onClick={onOpen}
          leftIcon={
            <AddIcon />
          }>
          <Text>
            Agregar curso
          </Text>
        </MenuButton>
        <MenuList>
          <MenuItem>Interno</MenuItem>
          <MenuItem>Externo</MenuItem>
        </MenuList>
      </Menu>
    </Flex>
  )
}

export default AddCourseMenu