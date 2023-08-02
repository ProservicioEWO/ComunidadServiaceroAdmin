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
      <HashLoader
        size={65}
        color={color} />
    </Box>
  )
}

export default Loading