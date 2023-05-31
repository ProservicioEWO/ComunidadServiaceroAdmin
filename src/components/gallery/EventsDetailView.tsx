import CustomFileInput from '../CustromFileInput';
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
  Box
} from '@chakra-ui/react';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ImageThumbnail from './ImageThumbnail';
import useS3 from '../../hooks/useS3';

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
          <Box>
            {
              imageListState.loading ?
                <Text>Cargado...</Text> :
                imageListState.data ?
                  <SimpleGrid w="full" columns={4} spacing={4}>
                    {
                      imageListState.data.map((e, i) => (
                        <ImageThumbnail
                          key={i}
                          description={e.split("/").pop() ?? ""}
                          src={`${BASE_URL_IMG}/${e}`}
                          onDelete={async () => {
                            await handleDelete(e)
                          }} />
                      ))
                    }
                  </SimpleGrid> :
                  <Text>Agrega imágenes al evento.</Text>
            }
          </Box>
        </VStack>
      </CardBody>
    </Card>
  )
}

export default EventsDetailView