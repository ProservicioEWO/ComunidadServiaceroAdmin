import CustomFileInput from '../CustromFileInput';
import useAppContext from '../../hooks/useAppContext';
import useCustomToast from '../../hooks/useCustomToast';
import { AddIcon, DeleteIcon } from '@chakra-ui/icons';
import { BASE_URL_IMG } from '../../shared/cs-constants';
import {
  Text,
  Card,
  CardBody,
  Divider,
  FormControl,
  Image,
  SimpleGrid,
  VStack,
  Icon
} from '@chakra-ui/react';
import { DeleteObjectCommand, ListObjectsCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ImageThumbnail from './ImageThumbnail';

const s3Client = new S3Client({
  region: 'us-east-1',
  credentials: {
    accessKeyId: 'keyid',
    secretAccessKey: 'secretkey'
  },
  forcePathStyle: true,
  endpoint: 'http://localhost:4566'
})

export interface EventParams extends Record<string, string> {
  eventId: string
}

export interface UploadImageResult {
  filename: string
  success: boolean
  error?: Error
}

async function uploadImagesToS3(files: FileList, dir: string): Promise<UploadImageResult[]> {
  try {
    const uploadPromises = [...files].map(async file => {
      const result: UploadImageResult = {
        filename: file.name,
        success: false
      }

      const command = new PutObjectCommand({
        Bucket: 'cs-resources',
        Key: `events/${dir}/${file.name}`,
        Body: file,
        ACL: 'public-read'
      })

      try {
        await s3Client.send(command);
        result.success = true
      } catch (error) {
        if (error instanceof Error) {
          result.error = error
        }
      }
      return result
    })
    const uploadResults = await Promise.all(uploadPromises)
    return uploadResults
  } catch (error) {
    throw new Error(`Error al subir las imágenes. ${error}`)
  }
}

async function deleteImageFromS3(imageKey: string): Promise<boolean> {
  const command = new DeleteObjectCommand({
    Bucket: 'cs-resources',
    Key: imageKey
  })

  try {
    await s3Client.send(command)
    return true
  } catch (error) {
    return false
  }
}

async function fetchImagesFromS3(path: string): Promise<string[] | null> {
  const command = new ListObjectsCommand({
    Bucket: 'cs-resources',
    Prefix: path,
  });

  try {
    const response = await s3Client.send(command);
    if (response.Contents) {
      return response.Contents.map(objeto => objeto.Key ?? "");
    }
    return []
  } catch (error) {
    return null
  }
}

const EventsDetailView = () => {
  const { events } = useAppContext()
  const { errorToast, successToast } = useCustomToast()
  const { eventId } = useParams<EventParams>()
  const [images, setImages] = useState<string[]>([])

  const handleFileChange = async (files: FileList) => {
    if (eventId) {
      try {
        const uploadResults = await uploadImagesToS3(files, eventId)
        const imagesWithError = uploadResults.filter(result => !result.success)
        if (imagesWithError.length > 0) {
          const fileList = imagesWithError.map(e => `${e.filename}\n`)
          errorToast(`Las siguientes imagenes no se subieron correctamente.:\n${fileList}`)
        } else {
          const images = await fetchImagesFromS3(`events/${eventId}`)
          if (images) {
            setImages(images)
          }
          successToast("Las imágenes se cargaron con éxito.")
        }

      } catch (error) {
        if (error instanceof Error) {
          errorToast(error.message)
        }
      }
    }
  }

  const handleDelete = async (imageKey: string) => {
    const ok = await deleteImageFromS3(imageKey)
    if (ok) {
      const images = await fetchImagesFromS3(`events/${eventId}`)
      if (images) {
        setImages(images)
      }
      successToast("Se eliminó la imagen con éxito.")
    } else {
      errorToast("Hubó un error al momento de eliminar la imagen.")
    }
  }

  useEffect(() => {
    (async () => {
      const images = await fetchImagesFromS3(`events/${eventId}`)
      if (images) {
        setImages(images)
      }
    })()
  }, [eventId])

  return (
    <Card w="full">
      <CardBody>
        <VStack>
          <FormControl>
            <CustomFileInput
              isDisabled={events.state.loading}
              icon={AddIcon}
              text="Agregar imagenes"
              onChange={handleFileChange} />
          </FormControl>
          <Divider />
          {
            images.length ?
              <SimpleGrid w="full" columns={4} spacing={4}>
                {
                  images.map((e, i) => (
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
        </VStack>
      </CardBody>
    </Card>
  )
}

export default EventsDetailView