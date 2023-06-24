import {
  Button,
  Divider,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  ModalProps
} from '@chakra-ui/react';
import { ReactNode } from 'react';

export interface FormModalProps {
  title: string
  isOpen: boolean
  isSubmitting: boolean
  children: ReactNode | ReactNode[]
  onClose: () => void
  onConfirm: () => void
}

const FormModal = ({ title, isOpen, isSubmitting, children, onClose, onConfirm }: FormModalProps) => {
  return (
    <Modal
      size='6xl'
      isOpen={isOpen}
      onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          {title}
        </ModalHeader>
        <ModalCloseButton isDisabled={isSubmitting}/>
        <Divider />
        <ModalBody>
          {children}
        </ModalBody>
        <ModalFooter>
          <Button
            isDisabled={isSubmitting}
            colorScheme='red'
            mr={3}
            onClick={onClose}>
            Cancelar
          </Button>
          <Button
          isLoading={isSubmitting}
          loadingText='Creando' 
          onClick={onConfirm}>
            Aceptar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default FormModal