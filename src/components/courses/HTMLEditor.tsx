import { Editor } from '@tinymce/tinymce-react';
import { Box, Spinner, Text } from '@chakra-ui/react';
import { useEffect, useState } from 'react';

export interface HTMLEditorProps {
  isInvalid: boolean
  errorMessage: string
  onChange: (value: string) => void
}

const HTMLEditor = ({ isInvalid, errorMessage, onChange }: HTMLEditorProps) => {

  const handleEditorChange = (value: string) => {
    onChange(value)
  }

  return (
    <>
      <Box
        border="2px"
        borderRadius="xl"
        borderColor={isInvalid ? "#E53E3E" : "transparent"}>
        <Editor
          onEditorChange={handleEditorChange}
          apiKey="ap0y95hao27a72hufoc684uiwtq58nezzae21i1usjd9h7ic"
          init={{
            branding: false,
            height: 300,
            menubar: true,
            plugins: [
              'advlist', 'autolink', 'lists', 'link', 'image', 'charmap',
              'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
              'insertdatetime', 'media', 'table', 'preview', 'help', 'wordcount'
            ],
            toolbar: `undo redo | blocks |
              'bold italic forecolor | alignleft aligncenter
              'alignright alignjustify | bullist numlist outdent indent |
              'removeformat | help | preview`,
            image_list: [
              {
                title: 'Nokia',
                value: 'https://upload.wikimedia.org/wikipedia/commons/b/b6/Image_created_with_a_mobile_phone.png'
              }
            ]
          }}
        />
      </Box>
      {isInvalid && <Text fontSize="sm" color="#E53E3E">{errorMessage}</Text>}
    </>
  )
}

export default HTMLEditor