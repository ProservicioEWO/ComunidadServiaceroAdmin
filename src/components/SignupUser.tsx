import { Avatar, HStack, Text, VStack } from "@chakra-ui/react"

interface SignupUserProps {
  user: string,
  fullname: string,
  photoUrl?: string
}

const SignupUser = ({ user, fullname, photoUrl }: SignupUserProps) => {
  return (
    <HStack>
      <VStack align="end" spacing="0">
        <Text fontSize="sm" as="b">{fullname}</Text>
        <Text fontSize="xs">{user}</Text>
      </VStack>
      <Avatar name={fullname} src={photoUrl} />
    </HStack>
  )
}

export default SignupUser