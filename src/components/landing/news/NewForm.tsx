import { AiFillPicture } from 'react-icons/ai';
import {
  Box,
  Center,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  Image,
  Input,
  Spinner,
  Text,
  Textarea,
  useBoolean,
  VStack
} from '@chakra-ui/react';
import {
  ChangeEvent,
  ForwardedRef,
  forwardRef,
  useState
} from 'react';
import { getBase64 } from '../../../shared/utils';
import { News } from '../../../models/News';
import { SubmitHandler, useForm } from 'react-hook-form';
import { IoIosUndo } from 'react-icons/io'

export interface NewsEditFormValues {
  title: string
  description: string
  link: string
  date: string
}

export interface ExpandedNewsEditFromValues {
  imageList: FileList | null,
  values: NewsEditFormValues
}

export interface NewFormProps {
  data: News,
  imageUrl?: string
  onUpdate: SubmitHandler<ExpandedNewsEditFromValues>
}

const NewForm = forwardRef(({ data, imageUrl, onUpdate }: NewFormProps, ref: ForwardedRef<HTMLFormElement>) => {
  const [imgIsLoaded, setImgIsLoaded] = useBoolean(false)
  const [imageList, setImageList] = useState<FileList | null>(null)
  const [img64, setImg64] = useState<string | null>(null)
  const {
    formState: { errors },
    handleSubmit,
    register } = useForm<NewsEditFormValues>({
      values: data
    })

  const handleUpdate = (values: NewsEditFormValues) => {
    console.log("FORM", values);
    onUpdate({
      imageList,
      values
    })
  }

  const handleChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    setImageList(files)
    try {
      if (files) {
        const base64 = await getBase64(files[0])
        setImg64(base64)
      }
    } catch (error) {
      setImg64(null)
    }
  }

  const handleUndo = () => {
    setImageList(null)
    setImg64(null)
  }

  const handleImgLoad = () => {
    setImgIsLoaded.on()
  }

  return (
    <form ref={ref} onSubmit={handleSubmit(handleUpdate)}>
      <HStack align="start" spacing={4} mt={2}>
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
          {!imgIsLoaded && <Spinner />}
          <Image
            display={imgIsLoaded ? "block" : "none"}
            onLoad={handleImgLoad}
            maxH="sm" src={
              img64 ?
                img64 :
                imageUrl ?? ''
            } />
          <Center>
            <FormControl>
              {
                img64 ?
                  <Box
                    p={2}
                    w="full"
                    color="white"
                    role="button"
                    bg="red.300"
                    borderBottomRadius="md"
                    onClick={handleUndo}>
                    <HStack>
                      <IoIosUndo />
                      <Text>Deshacer</Text>
                    </HStack>
                  </Box> :
                  <FormLabel
                    p={2}
                    w="full"
                    color="white"
                    role="button"
                    bg="green.300"
                    borderBottomRadius="md">
                    <HStack>
                      <AiFillPicture />
                      <Text>Seleccionar</Text>
                    </HStack>
                  </FormLabel>

              }
              <Input
                display="none"
                type="file"
                onChange={handleChange} />
            </FormControl>
          </Center>
        </Box>
      </HStack>
    </form>
  )
})

export default NewForm