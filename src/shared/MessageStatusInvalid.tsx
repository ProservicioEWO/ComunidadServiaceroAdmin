import { Button, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay } from "@chakra-ui/react"
import { useState } from "react";

export interface MessageStatusInvalidProps {
  OnConfirm: () => Promise<void>
}

const MessageStatusInvalid = ({ OnConfirm }: MessageStatusInvalidProps) => {
  const [isOpen, setIsOpen] = useState(true);

  const onClose = () => {
    setIsOpen(false)
    OnConfirm()
  }

  return (
    <div>
      <Modal isOpen={isOpen} onClose={onClose} size="5xl" closeOnOverlayClick={false}>
        <ModalOverlay>
          <ModalContent>
            <ModalHeader>Inicie sesión de nuevo</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              Tu sesión ha expirado. Por favor, vuelve a iniciar sesión para continuar disfrutando de nuestros servicios y
              recursos. Gracias por tu comprensión.
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="blue" mr={3} onClick={onClose} >Ok</Button>
            </ModalFooter>
          </ModalContent>
        </ModalOverlay>

      </Modal>
    </div>
  )
}
export default MessageStatusInvalid