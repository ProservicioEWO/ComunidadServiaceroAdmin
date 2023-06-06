import CustomFileInput from '../CustomFileInput';
import useAppContext from '../../hooks/useAppContext';
import useCustomToast from '../../hooks/useCustomToast';
import { AddIcon } from '@chakra-ui/icons';
import { BASE_URL_IMG } from '../../shared/cs-constants';
import {
  Text,
  Card,
  CardBody,
  Divider,
  FormControl,
  SimpleGrid,
  VStack,
  Box,
  Fade,
  Spinner
} from '@chakra-ui/react';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ImageThumbnail from './ImageThumbnail';
import useS3 from '../../hooks/useS3';
import GalleryGrid from './GalleryGrid';

export interface EventParams extends Record<string, string> {
  eventId: string
}

const EventsDetailView = () => {
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
    credentials: {
      accessKeyId: 'keyid',
      secretAccessKey: 'secretkey'
    },
    forcePathStyle: true,
    endpoint: 'http://localhost:4566'
  }, 'cs-resources', `events/${eventId}`)

  const handleFileChange = async (files: FileList) => {
    const ok = await uploadImages(files)
    if (ok) {
      await fetchImages()
      successToast(`Las imágenes se cargaron con éxito.`)
    } else {
      errorToast("Se produjó un error al momento de subir las imágenes.")
    }
  }

  const handleDelete = async (imageKey: string) => {
    const ok = await deleteImage(imageKey)
    if (ok) {
      await fetchImages()
      successToast("Se eliminó la imagen con éxito.")
    }
  }

  useEffect(() => {
    if (imageListState.error) {
      errorToast("Ocurrió un error cargando las imágenes.")
    }
  }, [imageListState.error])

  useEffect(() => {
    if (uploadImageState.failedImages.length) {
      const errorList = uploadImageState.failedImages.map(({ filename }) => filename)
      errorToast(`Las siguientes imagenes no se subieron correctamente.\n${errorList.join()}`)
    }
  }, [uploadImageState.failedImages])

  useEffect(() => {
    if (uploadImageState.error) {
      errorToast(`Hubó un error al momento de eliminar la imagen. ${uploadImageState.error}`)
    }
  }, [uploadImageState.error])

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
            <GalleryGrid<string>
              isLoading={imageListState.loading}
              list={imageListState.data}
              emptyMessage="Agrega imágenes al evento."
              mapName={key => key.split("/").pop() ?? ""}
            >
              {
                (key, name, index) => (
                  <ImageThumbnail
                    key={index}
                    description={name ?? ""}
                    src={`${BASE_URL_IMG}/${key}`}
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