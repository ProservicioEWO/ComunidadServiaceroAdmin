import NewForm, { ExpandedNewsEditFromValues, NewsEditFormValues } from './NewForm';
import useCustomToast from '../../../hooks/useCustomToast';
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
  Image,
  Spacer,
  Spinner,
  Text,
  useDisclosure,
  VStack
} from '@chakra-ui/react';
import { EditIcon } from '@chakra-ui/icons';
import { News } from '../../../models/News';
import { useEffect, useRef, useState } from 'react';
import useUpdateData from '../../../hooks/useUpdateData';
import useAuthContext from '../../../hooks/useAuthContext';
import { fromCognitoIdentityPool } from '@aws-sdk/credential-providers';
import useS3 from '../../../hooks/useS3';
import useAppContext from '../../../hooks/useAppContext';

export interface NewsUpdateInfo {
  title: string
  description: string
  link: string
  date: string
  image: string
}

export interface NewsCardProps {
  data: News
}

const NewsCard = ({ data }: NewsCardProps) => {
  const { authSessionData: { accessToken, idToken } } = useAuthContext()
  const { news } = useAppContext()
  const { errorToast, successToast, closeAll } = useCustomToast()
  const {
    fetchImage,
    imageState,
    uploadImages,
    uploadImageState
  } = useS3({
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
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [isLoading, setIsLoading] = useState(true)
  const {
    error: updateError,
    loading: updateLoading,
    updateData
  } = useUpdateData<NewsUpdateInfo>()
  const formRef = useRef<HTMLFormElement | null>(null)
  const btnRef = useRef<HTMLButtonElement | null>(null)

  const handleUpdate = async (expandedValues: ExpandedNewsEditFromValues) => {
    const { imageList, values } = expandedValues
    const newImage = imageList ? imageList[0].name : data.image
    try {
      const ok = await updateData("/news/:id", {
        id: data.id
      }, {
        date: values.date,
        description: values.description,
        link: values.link,
        title: values.title,
        image: newImage,
      }, {
        jwt: accessToken!
      })

      if (ok) {
        if (imageList) {
          const filesOK = await uploadImages(imageList)
          if (filesOK) {
            await fetchImage(imageList[0].name)
            successToast("Se actualizó la imagen noticia con éxito")
          }
        }

        const nnews = news.list?.filter(e => e.id != data.id) ?? []
        news.set([{
          id: data.id,
          image: newImage,
          date: values.date,
          description: values.description,
          link: values.link,
          title: values.title
        }, ...nnews])

        successToast("Se actualizó la noticia con éxito")
        onClose()
      }
    } catch (error) {
      console.log(error)
    }
  }

  const confirmUpdate = () => {
    if (formRef.current) {
      const submitEvent = new Event('submit', { bubbles: true, cancelable: true })
      formRef.current.dispatchEvent(submitEvent)
    }
  }

  useEffect(() => {
    fetchImage(data.image)
  }, [])

  useEffect(() => {
    if (uploadImageState.error) {
      errorToast(uploadImageState.error.message)
    }

    if (!!uploadImageState.failedImages.length) {
      errorToast(`Hubo un error subiendo las imagenes\n: ${uploadImageState.failedImages.join(",")}`)
    }
  }, [uploadImageState.error, uploadImageState.failedImages])


  useEffect(() => {
    if (updateError) {
      errorToast(updateError)
    }
  }, [updateError])

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
        <Image
          display={isLoading ? "none" : undefined}
          onLoad={() => setIsLoading(false)}
          objectFit="cover"
          src={imageState.url ?? ''} />
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
      <Drawer
        placement="bottom"
        isOpen={isOpen}
        onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader
            borderBottomWidth='1px'>
            Editar {data.title}
          </DrawerHeader>
          <DrawerBody>
            <NewForm
              ref={formRef}
              data={data}
              imageUrl={imageState.url ?? ''}
              onUpdate={handleUpdate} />
          </DrawerBody>
          <DrawerFooter>
            <Button
              onClick={confirmUpdate}
              loadingText='Guardando'
              isLoading={updateLoading}
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