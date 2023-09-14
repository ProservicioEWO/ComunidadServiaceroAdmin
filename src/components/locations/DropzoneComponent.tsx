import {
  Accept,
  DropEvent,
  FileRejection,
  useDropzone
} from 'react-dropzone';
import { DownloadIcon } from '@chakra-ui/icons';
import {
  Box,
  Icon,
  List,
  ListIcon,
  ListItem,
  Text,
  VStack
} from '@chakra-ui/react';
import { useState } from 'react';
import { IconType } from 'react-icons';
import { AiOutlineCloudUpload } from 'react-icons/ai';

type OnDropCallback = <T extends File>(acceptedFiles: T[], fileRejections: FileRejection[], event: DropEvent) => void

export interface DropzoneComponentProps {
  accept?: Accept
  maxFiles?: number
  multiple?: boolean
  placeholder: string
  icon: IconType
  onDrop?: OnDropCallback
}

const DropzoneComponent = ({ placeholder, icon, accept, maxFiles, multiple = true, onDrop }: DropzoneComponentProps) => {

  const [draggedIn, setDraggedIn] = useState(false)
  const { getRootProps, getInputProps, acceptedFiles } = useDropzone({
    accept,
    maxFiles,
    multiple,
    onDrop
  })

  const handleDragEnter = (e: any) => {
    e.preventDefault()
    setDraggedIn(true)
  }

  const handleDragLeave = (e: any) => {
    e.preventDefault()
    setDraggedIn(false)
  }

  return (
    <Box
      p={12}
      borderColor={!draggedIn ? "gray.400" : "blue.400"}
      borderStyle='dashed'
      borderWidth="3px">
      <div
        {...getRootProps({
          className: 'dropzone',
          onDragEnter: handleDragEnter,
          onDragLeave: handleDragLeave
        })}>
        <input {...getInputProps()} />
        {
          !!acceptedFiles.length ?
            <List>
              {
                acceptedFiles.map((e, i) => (
                  <ListItem key={i}>
                    <ListIcon as={icon} />
                    {e.name}
                  </ListItem>
                ))
              }
            </List> :
            <VStack>
              <Icon fontSize='5xl' as={AiOutlineCloudUpload} />
              <Text>{placeholder}</Text>
            </VStack>
        }
      </div>
    </Box>
  )
}

export default DropzoneComponent