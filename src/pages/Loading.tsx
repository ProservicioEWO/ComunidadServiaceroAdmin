import { Box, VStack, Text } from "@chakra-ui/react"
import { useEffect, useState } from "react"
import { HashLoader } from "react-spinners"
import randomcolor from 'randomcolor'

const Loading = () => {

  const [color, setColor] = useState<string>("")

  useEffect(() => {
    setColor(randomcolor())
  }, [])

  return (
    <Box
      w="100vw"
      h="100vh"
      overflow="hidden"
      display="flex"
      justifyContent="center"
      alignItems="center">
      <VStack>
        <HashLoader
          size={65}
          color={color} />
        <Text fontSize="sm">Cargando...</Text>
      </VStack>
    </Box>
  )
}

export default Loading