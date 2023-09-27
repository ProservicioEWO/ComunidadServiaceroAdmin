import {
  Center,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  ModalProps,
  Text
} from '@chakra-ui/react';
import LogList from './LogList/LogList';

export interface LogsViewProps extends Omit<ModalProps, 'children'> { }

const LogsView = ({ isOpen, onClose }: LogsViewProps) => {
  return (
    <Modal size='5xl' scrollBehavior='inside' isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader borderBottom='1px solid #dedede'>
          <Text>Registro de inicios de sesión</Text>
          <ModalCloseButton />
        </ModalHeader>
        <ModalBody>
          <Center>
            <LogList />
          </Center>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

export default LogsView