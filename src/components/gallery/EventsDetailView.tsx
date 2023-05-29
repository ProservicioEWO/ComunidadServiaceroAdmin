import { AddIcon } from '@chakra-ui/icons'
import { Button, Card, CardBody, FormControl, Icon, Input } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import AWS from 'aws-sdk'
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import CustomFileInput from '../CustromFileInput'
import useAppContext from '../../hooks/useAppContext'
import useCustomToast from '../../hooks/useCustomToast'

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

async function fetchImagesFromS3(path: string) {
  
}

const EventsDetailView = () => {
  const { events } = useAppContext()
  const { errorToast, successToast } = useCustomToast()
  const { eventId } = useParams<EventParams>()
  const [text, setText] = useState("")

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
    if (eventId) {
      setText(eventId)
    }
  }, [eventId])

  return (
    <Card w="full">
      <CardBody>
        <FormControl>
          <CustomFileInput
            isDisabled={events.state.loading}
            icon={AddIcon}
            text="Agregar imagenes"
            onChange={handleFileChange} />
        </FormControl>
      </CardBody>
    </Card>
  )
}

export default EventsDetailView