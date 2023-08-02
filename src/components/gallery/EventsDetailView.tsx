import CustomFileInput from '../CustomFileInput';
import GalleryGrid from './GalleryGrid';
import ImageThumbnail from './ImageThumbnail';
import useAppContext from '../../hooks/useAppContext';
import useCustomToast from '../../hooks/useCustomToast';
import useS3 from '../../hooks/useS3';
import { AddIcon } from '@chakra-ui/icons';
import {
  Box,
  Card,
  CardBody,
  Divider,
  FormControl,
  Spinner,
  Text,
  VStack
} from '@chakra-ui/react';
import { fromCognitoIdentityPool } from '@aws-sdk/credential-providers';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import useAuthContext from '../../hooks/useAuthContext';

export interface EventParams extends Record<string, string> {
  eventId: string
}

const EventsDetailView = () => {
  const { authSessionData: { idToken } } = useAuthContext()
  const { events } = useAppContext()
  const { errorToast, successToast } = useCustomToast()
  const { eventId } = useParams<EventParams>()
  const {
    imageListState,
    uploadImageState,
    deleteImageState,
    deleteImage,
    uploadImages,
    fetchImages
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
  }, 'cs-static-res', `images/gallery/${eventId}`)

  const handleFileChange = async (files: FileList) => {
    const ok = await uploadImages(files)
    if (ok) {
      await fetchImages()
    } else {
      errorToast("Se produjó un error al momento de subir las imágenes.")
    }
  }

  const handleDelete = async (imageKey?: string) => {
    if (imageKey) {
      const ok = await deleteImage(imageKey)
      if (ok) {
        await fetchImages()
        successToast("Se eliminó la imagen con éxito.")
      }
    }
  }

  useEffect(() => {
    if (imageListState.error) {
      errorToast("Ocurrió un error cargando las imágenes.")
    }
  }, [imageListState.error])

  useEffect(() => {
    if (uploadImageState.failedImages.length > 0) {
      const errorList = uploadImageState.failedImages.map(({ filename }) => filename)
      errorToast(`Las siguientes imagenes no se subieron correctamente.\n${errorList.join()}`)
    }
  }, [uploadImageState.failedImages.length])

  useEffect(() => {
    if (deleteImageState.error) {
      errorToast(`Hubó un error al momento de eliminar la imagen. ${uploadImageState.error}`)
    }
  }, [deleteImageState.error])

  return (
    <Card w="full">
      <CardBody>
        <VStack>
          <FormControl>
            <CustomFileInput
              isDisabled={
                events.state.loading ||
                imageListState.loading ||
                uploadImageState.loading
              }
              icon={AddIcon}
              text="Agregar imagenes"
              onChange={async (files) => {
                await handleFileChange(files)
              }} />
          </FormControl>
          <Divider />
          <Box position="relative">
            <Box
              display={uploadImageState.loading ? "block" : "none"}
              w="full"
              position="absolute"
              bg="blackAlpha.600"
              color="white"
              zIndex="99"
              style={{ aspectRatio: 1 }}>
              <VStack gap="10px">
                <Spinner />
                <Text>Subiendo imágenes</Text>
              </VStack>
            </Box>
            <GalleryGrid<{ key?: string, url: string }>
              isLoading={imageListState.loading}
              list={imageListState.data}
              emptyMessage="Agrega imágenes al evento."
              mapName={({ key }) => key?.split("/").pop() ?? ""}
            >
              {
                ({ key, url }, name, index) => (
                  <ImageThumbnail
                    key={index}
                    description={name ?? ""}
                    src={url}
                    onDelete={async () => {
                      await handleDelete(key)
                    }} />
                )
              }
            </GalleryGrid>
          </Box>
        </VStack>
      </CardBody>
    </Card>
  )
}

export default EventsDetailView