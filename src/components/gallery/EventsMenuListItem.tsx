import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Badge,
  Box,
  Button,
  HStack,
  Icon,
  Spacer,
  Text,
  useBoolean,
  useDisclosure
} from '@chakra-ui/react';
import { DeleteIcon } from '@chakra-ui/icons';
import { useRef, memo } from 'react';

export interface EventsMenuListItemProps {
  text: string
  isLoading: boolean
  isActive: boolean
  onDelete: () => Promise<void>
}

const EventsMenuListItem = memo(({ text, isLoading, isActive, onDelete }: EventsMenuListItemProps) => {
  const [hovered, setHovered] = useBoolean()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const cancelRef = useRef<HTMLButtonElement>(null)
  return (
    <>
      <HStack
        onMouseEnter={setHovered.on}
        onMouseLeave={setHovered.off}
        style={{
          backgroundColor: isActive ? "#046F67" : "white",
          color: isActive ? "white" : "#046F67"
        }}
        p="2">
        <Text>{text}</Text>
        <Spacer />
        <Box>
          {
            hovered &&
            <Icon role='button' as={DeleteIcon} color='red.400' onClick={e => {
              e.preventDefault()
              onOpen()
            }} />
          }
        </Box>
      </HStack>
      <AlertDialog
        isOpen={isOpen}
        onClose={onClose}
        leastDestructiveRef={cancelRef}>
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader>
              Borrando registro
            </AlertDialogHeader>
            <AlertDialogBody>
              Este proceso borrara de forma permanente este registro y todo el contenido relacionado. ¿Desea continuar?
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>Cancelar</Button>
              <Button
                colorScheme='red'
                isLoading={isLoading}
                loadingText="Borrando"
                onClick={onDelete}
                ml={3}>
                Borrar
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  )
})

export default EventsMenuListItem