import {
  Box,
  Button,
  Center,
  Divider,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Heading,
  HStack,
  Icon,
  Image,
  Input,
  SlideFade,
  Text,
  theme, VStack
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { HiOutlineArrowRight } from 'react-icons/hi';
import { useNavigate } from 'react-router-dom';
import useAuthContext from "../hooks/useAuthContext";
import useCustomToast from '../hooks/useCustomToast';
import { BASE_URL_IMG_CDN } from '../shared/cs-constants';
import { getRndScheme, hexFromColorScheme } from '../shared/utils';

export interface LoginValues {
  username: string
  password: string
}

const Login = () => {
  const navigate = useNavigate()
  const {
    isBusy,
    hasError,
    authSessionData: { isAuthenticated },
    signIn
  } = useAuthContext()
  const { errorToast } = useCustomToast()
  const [isHover, setIsHover] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const [colorScheme, setColorScheme] = useState<keyof typeof theme.colors>("facebook")
  const {
    handleSubmit,
    register,
    formState: { errors }
  } = useForm<LoginValues>()

  const handleLogin = async ({ username, password }: LoginValues) => {
    const res = await signIn(username, password)
  }

  useEffect(() => {
    setColorScheme(getRndScheme())
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (hasError) {
      errorToast(hasError)
    }
  }, [hasError])

  return (
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      justifyContent="center"
      alignItems="center"
      overflow="hidden"
      bg="gray.100"
    >
      <SlideFade in={isMounted} offsetY="-100px">
        <VStack
          p={8}
          width="400px"
          bg="white"
          boxShadow="lg"
          rounded="md"
          align="stretch"
        >
          <Center pb={5}>
            <Image
              width={120}
              src={`${BASE_URL_IMG_CDN}/cs_lg.png`}
              alt='comunidad-isotipo'
            />
          </Center>
          <Divider />
          <HStack justify="center" align="baseline" spacing={0}>
            <Heading>Acceder</Heading>
            <Text color="gray.400" fontSize="lg">/admin</Text>
          </HStack>
          <Box py={6}>
            <form onSubmit={handleSubmit(handleLogin)}>
              <VStack spacing={4}>
                <FormControl isInvalid={!!errors.username}>
                  <FormLabel fontWeight="bold">Usuario</FormLabel>
                  <Input
                    placeholder='nombre.apellido'
                    size="lg"
                    borderLeft={`5px solid ${hexFromColorScheme(colorScheme)}`}
                    shadow="md"
                    {...register("username", { required: true })} />
                  <FormErrorMessage>Introduce tu nombre de usuario</FormErrorMessage>
                  <FormHelperText color="gray.400">
                    Usuario de comunidad serviacero.
                  </FormHelperText>
                </FormControl>
                <FormControl isInvalid={!!errors.password}>
                  <FormLabel fontWeight="bold">Contraseña</FormLabel>
                  <Input
                    type="password"
                    placeholder='Ingresa tu contraseña'
                    size="lg"
                    borderLeft={`5px solid ${hexFromColorScheme(colorScheme)}`}
                    shadow="md"
                    {...register("password", { required: true })} />
                  <FormErrorMessage>Introduce tu contraseña</FormErrorMessage>
                </FormControl>
                <Button
                  type="submit"
                  size="lg"
                  width="full"
                  position="relative"
                  loadingText="Entrando..."
                  isLoading={isBusy}
                  colorScheme={colorScheme}
                  transition="background-color 0.5s"
                  onMouseEnter={() => {
                    setIsHover(true)
                    setColorScheme(getRndScheme())
                  }}
                  onMouseLeave={() => setIsHover(false)}
                >
                  <HStack
                    w="full"
                    position="absolute"
                    left={!isHover ? "25px" : "calc(76% - 25px)"}
                    transition="left 0.2s">
                    <Text>Entrar</Text>
                    <Icon as={HiOutlineArrowRight} fontSize='3xl' />
                  </HStack>
                </Button>
              </VStack>
            </form>
          </Box>
        </VStack>
      </SlideFade>
    </Box>
  )
}

export default Login