import {
  Box,
  Divider,
  ListItem,
  Text,
  Tooltip,
  UnorderedList
} from '@chakra-ui/react';
import { ReactNode } from 'react';

const PasswordReqInfo = ({ children }: { children: ReactNode }) => {
  return (
    <Tooltip
      hasArrow
      placement='end-start'
      bg='gray.50'
      color='gray.500'
      label={
        <Box p={2}>
          <Text>Requisitos de la contraseña:</Text>
          <UnorderedList>
            <ListItem>Contiene al menos 1 número</ListItem>
            <ListItem>Contiene al menos 1 carácter especial</ListItem>
            <ListItem>Contiene al menos una letra mayúscula</ListItem>
            <ListItem>Contiene al menos una letra minúscula</ListItem>
          </UnorderedList>
        </Box>
      }>
      {children}
    </Tooltip>
  )
}

export default PasswordReqInfo