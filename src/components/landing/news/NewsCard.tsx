import { fromCognitoIdentityPool } from '@aws-sdk/credential-providers';
import { EditIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Center,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  Image,
  Input, Spacer,
  Spinner,
  Text,
  Textarea,
  useDisclosure,
  VStack
} from '@chakra-ui/react';
import { useEffect, useRef, useState } from 'react';
import Dropzone from 'react-dropzone';
import { Controller, useForm } from 'react-hook-form';
import useAuthContext from '../../../hooks/useAuthContext';
import useCustomToast from '../../../hooks/useCustomToast';
import useS3 from '../../../hooks/useS3';
import { News } from '../../../models/News';
import { getBase64 } from '../../../shared/utils';

export interface NewsEditFormValues {
  title: string
  description: string
  link: string
  image: string
  date: string
}

export interface NewsCardProps {
  data: News
}

const NewsCard = ({ data }: NewsCardProps) => {
  const {
    formState: { errors, isSubmitting },
    control,
    handleSubmit,
    register
  } = useForm<NewsEditFormValues>({
    values: {
      title: data.title,
      description: data.description,
      link: data.link,
      image: data.image,
      date: data.date
    }
  })
  const { errorToast, closeAll } = useCustomToast()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [isLoading, setIsLoading] = useState(true)
  const { authSessionData: { idToken } } = useAuthContext()
  const { fetchImage, imageState } = useS3({
    region: 'us-east-1',
    credentials: fromCognitoIdentityPool({
      identityPoolId: 'us-east-1:12c9962b-8973-4f7d-b1ce-b667f563ffac',
      clientConfig: {
        region: 'us-east-1'
      },
      logins: {
        'cognito-idp.us-east-1.amazonaws.com/us-east-1_oud83NQk8': idToken!
      }
    }),
    forcePathStyle: true
  }, 'cs-static-res', `images/news`)
  const btnRef = useRef<any>()

  const handleDrop = async (files: File[]) => {
    const base64 = await getBase64(files[0])
  }

  const onUpdateNews = async () => {

  }

  useEffect(() => {
    fetchImage(data.image)
  }, [])

  useEffect(() => {
    if (imageState.error) {
      errorToast(imageState.error.message)
    }
  }, [imageState.error])


  return (
    <>
      <Card
        borderWidth="1px"
        borderColor="gray.100"
        bg="gray.50">
        <CardHeader>
          <VStack align="start">
            <Text
              noOfLines={2}
              fontWeight="bold"
              fontSize="lg">
              {data.title}
            </Text>
            <Text color="facebook.300">{data.date}</Text>
          </VStack>
        </CardHeader>
        <CardBody>
          <Text
            noOfLines={5}
            textAlign="justify">
            {data.description}
          </Text>
        </CardBody>
        {
          isLoading &&
          <Box>
            <Center>
              <Spinner />
            </Center>
          </Box>
        }
        <Image display={isLoading ? "none" : undefined} onLoad={() => setIsLoading(false)}
          objectFit="cover" src={imageState.url ?? ''} />
        <CardFooter>
          <Spacer />
          <Button
            ref={btnRef}
            isDisabled={isLoading}
            colorScheme='purple'
            aria-label='See menu'
            leftIcon={<EditIcon />}
            onClick={onOpen}>
            Editar
          </Button>
        </CardFooter>
      </Card>
      <Drawer placement="bottom" isOpen={isOpen} onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader
            borderBottomWidth='1px'>
            {data.title}
          </DrawerHeader>
          <DrawerBody>
            <form onSubmit={handleSubmit(onUpdateNews)}>
              <HStack align="start" spacing={4} p={4}>
                <VStack spacing={4} w="full">
                  <FormControl variant='floating' isInvalid={!!errors.title}>
                    <Input {...register("title")} />
                    <FormLabel>Título</FormLabel>
                    <FormErrorMessage></FormErrorMessage>
                  </FormControl>
                  <FormControl variant='floating' isInvalid={!!errors.description}>
                    <Textarea {...register("description")} />
                    <FormLabel>Descripcion</FormLabel>
                  </FormControl>
                  <HStack width="full">
                    <FormControl flexBasis="80%" variant='floating' isInvalid={!!errors.link}>
                      <Input {...register("link")} />
                      <FormLabel>Link</FormLabel>
                    </FormControl>
                    <FormControl flexBasis="20%" variant='floating' isInvalid={!!errors.date}>
                      <Input {...register("date")} />
                      <FormLabel>Fecha</FormLabel>
                    </FormControl>
                  </HStack>
                </VStack>
                <Box
                  shadow="md"
                  borderWidth="10px"
                  borderColor="white">
                  <Controller
                    name="image"
                    control={control}
                    render={({ field }) => (
                      <Dropzone
                        maxFiles={1}
                        multiple={false}
                        onDrop={handleDrop}>
                        {
                          ({ getRootProps, getInputProps, acceptedFiles }) => (
                            <div {...getRootProps()}>
                              <input {...getInputProps()} />
                              {
                                !!acceptedFiles.length ?
                                  <Image maxH="sm" src={"imageBase64"} /> :
                                  <Image maxH="sm" src={imageState.url ?? ''} />
                              }
                            </div>
                          )
                        }
                      </Dropzone>
                    )} />
                </Box>
              </HStack>
            </form>
          </DrawerBody>
          <DrawerFooter>
            <Button
              loadingText='Guardando'
              isLoading={isSubmitting}
              colorScheme="purple">
              Guardar
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  )
}

export default NewsCard