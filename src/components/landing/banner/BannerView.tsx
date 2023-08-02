import { fromCognitoIdentityPool } from "@aws-sdk/credential-providers"
import { AddIcon } from "@chakra-ui/icons"
import { Box, Divider, FormControl, Spinner, Text, VStack } from "@chakra-ui/react"
import useAuthContext from "../../../hooks/useAuthContext"
import useCustomToast from "../../../hooks/useCustomToast"
import useS3 from "../../../hooks/useS3"
import CustomFileInput from "../../CustomFileInput"
import GalleryGrid from "../../gallery/GalleryGrid"
import ImageThumbnail from '../../gallery/ImageThumbnail'

const BannerView = () => {
  const { errorToast, successToast } = useCustomToast()
  const { authSessionData: { idToken } } = useAuthContext()
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
  }, 'cs-static-res', `images/banner`)

  const handleImageDelete = async (key?: string) => {
    if (key) {
      const ok = await deleteImage(key)
      if (ok) {
        await fetchImages()
        successToast("Se eliminó la imagen con éxito.")
      }
    }
  }

  const handleFileChange = async (files: FileList) => {
    const ok = await uploadImages(files)
    if (ok) {
      await fetchImages()
    } else {
      errorToast("Se produjó un error al momento de subir las imágenes.")
    }
  }

  return (
    <VStack>
      <FormControl>
        <CustomFileInput
          isDisabled={
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
                  await handleImageDelete(key)
                }} />
            )
          }
        </GalleryGrid>
      </Box>
    </VStack>
  )
}

export default BannerView