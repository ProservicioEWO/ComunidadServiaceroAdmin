import { AddIcon } from '@chakra-ui/icons'
import { Button, Card, CardBody, FormControl, Icon, Image, Input, List, ListItem, VStack } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import AWS from 'aws-sdk'
import { ListObjectsCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import CustomFileInput from '../CustromFileInput'
import useAppContext from '../../hooks/useAppContext'
import useCustomToast from '../../hooks/useCustomToast'
import { BASE_URL_IMG } from '../../shared/cs-constants'

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

async function uploadImageToS3(file: File, dir: string): Promise<string> {
  const command = new PutObjectCommand({
    Bucket: 'cs-resources',
    Key: `events/${dir}/${file.name}`,
    Body: file,
    ACL: 'public-read'
  });

  try {
    await s3Client.send(command);
    const imageUrl = `http://localhost:4566/cs-resources/events/${dir}/${file.name}`;
    return imageUrl;
  } catch (error) {
    throw new Error(`Error al cargar la imagen. ${error}`);
  }
}

async function fetchImagesFromS3(path: string): Promise<string[]> {
  const command = new ListObjectsCommand({
    Bucket: 'cs-resources',
    Prefix: path,
  });

  try {
    const response = await s3Client.send(command);
    if (response.Contents) {
      return response.Contents.map(objeto => objeto.Key ?? "");
    }
    return [];
  } catch (error) {
    throw new Error(`Error al obtener los objetos de S3. ${error}`);
  }
}

const EventsDetailView = () => {
  const { events } = useAppContext()
  const { errorToast, successToast } = useCustomToast()
  const { eventId } = useParams<EventParams>()
  const [images, setImages] = useState<string[]>([])

  const handleFileChange = async (file: File) => {
    if (eventId) {
      try {
        const fileURL = await uploadImageToS3(file, eventId)
        successToast(`Se cargo correctamente la imagen con ruta. ${fileURL}`)
      } catch (error) {
        if (error instanceof Error) {
          errorToast(error.message)
        }
      }
    }
  }

  useEffect(() => {
    (async () => {
      const images = await fetchImagesFromS3(`events/${eventId}`)
      setImages(images)
    })()
  }, [])

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
          <VStack>
            {
              images.map((e, i) => (
                <Image key={i} src={`${BASE_URL_IMG}/${e}`} />
              ))
            }
          </VStack>
        </VStack>
      </CardBody>
    </Card>
  )
}

export default EventsDetailView