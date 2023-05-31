import { AiOutlineZoomIn } from 'react-icons/ai'
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Box,
  Button,
  Text,
  Fade,
  HStack,
  Icon,
  IconButton,
  Image,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useBoolean,
  useDisclosure,
  Center
} from '@chakra-ui/react'
import { CloseIcon, DeleteIcon } from '@chakra-ui/icons'
import { useRef } from 'react';

export interface ImageThumbnailProps {
  src: string,
  description: string
  onDelete: () => Promise<void>
}

const ImageThumbnail = ({ src, description, onDelete }: ImageThumbnailProps) => {
  const [isDeleting, setIsDeleting] = useBoolean()
  const [isHover, setIsHover] = useBoolean()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { isOpen: isOpenM, onOpen: onOpenM, onClose: onCloseM } = useDisclosure()
  const cancelRef = useRef<HTMLButtonElement>(null)

  const handleDeleteOnClick = async () => {
    setIsDeleting.on()
    await onDelete()
    setIsDeleting.off()
    onClose()
  }

  return (
    <>
      <Box
        shadow="md"
        overflow="hidden"
        position="relative"
        style={{ aspectRatio: 1 }}
        onMouseEnter={setIsHover.on}
        onMouseLeave={setIsHover.off}>
        <Fade in={isHover}>
          <Box
            display="flex"
            position="absolute"
            alignItems="center"
            justifyContent="center"
            boxSize="full"
            backgroundColor="blackAlpha.400" >
            <HStack>
              <IconButton
                color='white'
                icon={<Icon as={AiOutlineZoomIn} boxSize="40px" />}
                variant='unstyled'
                aria-label='zoom'
                onClick={onOpenM} />
              <IconButton
                color="red.500"
                icon={<Icon as={DeleteIcon} boxSize="40px" />}
                variant='unstyled'
                aria-label='delete'
                onClick={onOpen} />
            </HStack>
          </Box>
        </Fade>
        <Image src={src} objectFit="cover" h="full" w="full" />
      </Box>
      <AlertDialog
        isOpen={isOpen}
        onClose={onClose}
        leastDestructiveRef={cancelRef}>
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader>
              Borrando imágen
            </AlertDialogHeader>
            <AlertDialogBody>
              <p>
                Estás a punto de borrar una imagen de evento.
              </p>
              <p>
                ¿Desea continuar?
              </p>
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>Cancelar</Button>
              <Button
                colorScheme='red'
                isLoading={isDeleting}
                loadingText="Borrando"
                onClick={handleDeleteOnClick}
                ml={3}>
                Borrar
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
      <Modal size='6xl' isOpen={isOpenM} onClose={onCloseM}>
        <ModalOverlay />
        <ModalContent>
          <ModalBody p={1}>
            <Center>
              <Image w="full" src={src} />
            </Center>
          </ModalBody>
          <ModalFooter>
            <Text w="full">{description}</Text>
            <Button onClick={onCloseM}>Cerrar</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default ImageThumbnail