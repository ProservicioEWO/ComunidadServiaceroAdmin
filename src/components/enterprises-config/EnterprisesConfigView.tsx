import ConfigMenu from './ConfigMenu';
import {
  Modal,
  Text,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Center
} from '@chakra-ui/react';

export interface EnterprisesConfigProps {
  onClose: () => void
  isOpen: boolean
}


const EnterprisesConfigView = ({ isOpen, onClose }: EnterprisesConfigProps) => {
  return (
    <Modal size='2xl' isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader borderBottom='1px solid #dedede'>
          <Text>Configurando empresas</Text>
          <ModalCloseButton />
        </ModalHeader>

        <ModalBody>
          <Center>
            <ConfigMenu />
          </Center>
        </ModalBody>

        {/* <ModalFooter>
          <Button colorScheme='red' mr={3} onClick={onClose}>
            Cancelar
          </Button>
          <Button colorScheme='purple'>Aceptar</Button>
        </ModalFooter> */}
      </ModalContent>
    </Modal>
  )
}

export default EnterprisesConfigView