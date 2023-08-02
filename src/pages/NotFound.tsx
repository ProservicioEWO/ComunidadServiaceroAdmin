import { Box, Button, Heading, HStack, Icon, Text } from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'
import { CSLeftArrowIcon, CSPuzzleIcon } from '../icons/CSIcons'

const NotFound = () => {
  const navigate = useNavigate()
  const handleGoBack = () => navigate(-1)
  return (
    <Box
      bg="gray.50"
      minH="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <Box textAlign="center">
        <HStack>
          <Heading as="h1" m="0 auto" size="4xl">
            <CSPuzzleIcon color="gray.400" />
            <Text>404</Text>
          </Heading>
        </HStack>
        <Text fontSize="xl" fontWeight="medium" mt="6">
          ¡Vaya! La página que estás buscando no existe.
        </Text>
        <Button
          leftIcon={
            <Icon as={CSLeftArrowIcon} />
          }
          colorScheme="teal"
          mt="6"
          onClick={handleGoBack}>
          Regresar
        </Button>
      </Box>
    </Box>
  )
}

export default NotFound