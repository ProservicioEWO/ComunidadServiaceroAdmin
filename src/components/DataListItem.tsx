import React, { useRef } from 'react';
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  HStack,
  Icon,
  IconButton,
  SlideFade,
  Spacer,
  StackProps,
  useBoolean,
  useDisclosure
} from '@chakra-ui/react';
import { CSDeleteUser } from '../icons/CSIcons';

export interface DataListItemOptions {
  icon?: React.ReactElement<any, string | React.JSXElementConstructor<any>> | undefined
}

export interface DataListItemProps extends Omit<StackProps, 'children'> {
  children: React.ReactNode | React.ReactNode[]
  loading: boolean
  options?: DataListItemOptions
  onDelete: () => Promise<void>
}

const DataListItem = (({ children, loading, options, onDelete, ...props }: DataListItemProps) => {
  const hover = {
    bg: "gray.100"
  }
  const cancelRef = useRef<HTMLButtonElement>(null)
  const [showButton, setShowButton] = useBoolean()
  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <HStack
      w="full"
      p="4"
      align='stretch'
      alignItems='center'
      _hover={hover}
      cursor="pointer"
      onMouseEnter={setShowButton.on}
      onMouseLeave={setShowButton.off}
      {...props}>
      {children}
      <Spacer />
      <SlideFade in={showButton} offsetX="20px" offsetY="0">
        <IconButton aria-label='Delete user'
          variant="unstyled"
          zIndex={"overlay"}
          onClick={ e =>{
            e.stopPropagation()
            onOpen()
          }}
          icon={
            options?.icon ??
            <Icon stroke="tomato"
              fontSize="2xl"
              as={CSDeleteUser}
            />
          } />
        <AlertDialog
          isOpen={isOpen}
          leastDestructiveRef={cancelRef}
          onClose={onClose}>
          <AlertDialogOverlay>
            <AlertDialogContent>
              <AlertDialogHeader fontSize="lg" fontWeight="bold">
                Borrando registro
              </AlertDialogHeader>
              <AlertDialogBody>
                ¿Estas seguro que quieres borrar este registro? Esta accion es permanente.
              </AlertDialogBody>
              <AlertDialogFooter>
                <Button ref={cancelRef} onClick={onClose}>Cancelar</Button>
                <Button colorScheme="red"
                  isLoading={loading}
                  loadingText="Borrando"
                  ml={3}
                  onClick={async (e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    await onDelete()
                    onClose()
                  }}>
                  Borrar
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialogOverlay>
        </AlertDialog>
      </SlideFade>
    </HStack>
  )
})

export default DataListItem