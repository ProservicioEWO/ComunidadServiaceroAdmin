import { Button, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay } from "@chakra-ui/react"
import { useState } from "react";
import { handleModalClick } from "./utils";

const MessageStatusInvalid = () => {
  const [isOpen, setIsOpen] = useState(true);

  const onClose = () =>{
    handleModalClick()
    setIsOpen(false)
  }
  
  return (
    <div>
      <Modal isOpen={isOpen} onClose={onClose} size="5xl" closeOnOverlayClick={false}>
        <ModalOverlay>
          <ModalContent>
            <ModalHeader>Inicie sesión de nuevo</ModalHeader>
            <ModalCloseButton/>
            <ModalBody>
              Tu sesión ha expirado. Por favor, vuelve a iniciar sesión para continuar disfrutando de nuestros servicios y
              recursos. Gracias por tu comprensión.
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="blue" mr={3} onClick={handleModalClick} >Ok</Button>
            </ModalFooter>
          </ModalContent>
        </ModalOverlay>

      </Modal>
    </div>
  )
}
export default MessageStatusInvalid