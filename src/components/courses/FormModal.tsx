import Lottie from 'lottie-react';
import SettingLoadingAnimation from '../../lotties/setting-loading.json';
import {
  Box,
  Button,
  Divider,
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay
} from '@chakra-ui/react';
import { ReactNode, useEffect } from 'react';
import useAppContext from '../../hooks/useAppContext';

export interface FormModalProps {
  title: string
  isOpen: boolean
  isSubmitting: boolean
  isLoading: boolean
  mode: 'edit' | 'set'
  children: ReactNode | ReactNode[]
  onClose: () => void
  onConfirm: () => void
}

const FormModal = ({ title, isOpen, isSubmitting, isLoading, mode, children, onClose, onConfirm }: FormModalProps) => {
  const { locations } = useAppContext()

  //PARA CAMBIAR LUEGO
  useEffect(() => {
    locations.fetch()
  }, [])

  return (
    <Modal
      size={mode === 'edit' ? (isLoading || locations.state.loading ? 'md' : 'full') : 'full'}
      isOpen={isOpen}
      onClose={onClose}
      scrollBehavior="inside">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          {title}
        </ModalHeader>
        <ModalCloseButton isDisabled={isSubmitting} />
        <Divider />
        <ModalBody>
          {
            mode === 'edit' ?
              (
                isLoading || locations.state.loading ?
                  <Box w="full">
                    <Flex boxSize="full" align="center" justify="center">
                      <Lottie animationData={SettingLoadingAnimation} />
                    </Flex>
                  </Box> :
                  children
              ) : children
          }
        </ModalBody>
        {
          (mode === 'edit' ? !isLoading && !locations.state.loading : true) &&
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
              loadingText='Guardando'
              onClick={onConfirm}>
              Aceptar
            </Button>
          </ModalFooter>
        }
      </ModalContent>
    </Modal>
  )
}

export default FormModal