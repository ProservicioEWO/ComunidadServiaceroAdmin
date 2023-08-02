import {
  DeleteObjectCommand,
  DeleteObjectsCommand,
  GetObjectCommand,
  ListObjectsV2Command,
  PutObjectCommand,
  S3Client,
  S3ClientConfig
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { useEffect, useState } from 'react';

export interface UseS3Type {
  imageState: ImageState
  imageListState: ImageListState
  uploadImageState: UploadImageState
  deleteImageState: DeleteFileState
  fetchImage: (filename: string) => Promise<void>
  fetchImages: () => Promise<void>
  deleteImage: (filename: string) => Promise<boolean>
  uploadImages: (files: FileList) => Promise<boolean>
}

export interface UploadImageError {
  filename: string
  error: Error
}

export interface ImageState {
  loading: boolean
  url: string | null
  error?: Error
}

export interface ImageListState {
  loading: boolean
  data: { key?: string, url: string }[] | null
  error?: Error
}

export interface UploadImageState {
  loading: boolean
  uploadedImages: string[]
  failedImages: UploadImageError[]
  error?: Error
}

export interface DeleteFileState {
  loading: boolean
  error?: Error
}

const useS3 = (config: S3ClientConfig, bucket: string, prefix?: string): UseS3Type => {
  const s3Client = new S3Client(config)
  const [
    imageState,
    setImageState
  ] = useState<ImageState>({
    url: null,
    loading: false
  })
  const [
    imageListState,
    setImageListState
  ] = useState<ImageListState>({
    data: null,
    loading: false
  })
  const [
    uploadImageState,
    setUploadImageState
  ] = useState<UploadImageState>({
    loading: false,
    uploadedImages: [],
    failedImages: []
  })
  const [
    deleteImageState,
    setDeleteImageState
  ] = useState<DeleteFileState>({
    loading: false
  })

  const fetchImage = async (filename: string) => {
    setImageListState({ loading: true, data: null })
    try {
      const response = await getSignedUrl(s3Client, new GetObjectCommand({
        Bucket: bucket,
        Key: `${prefix}/${filename}`
      }), { expiresIn: 3000 })

      setImageState({
        loading: false,
        url: response
      })
    } catch (error) {
      if (error instanceof Error) {
        setImageState({
          loading: false,
          url: null,
          error
        })
      }
    }
  }

  const fetchImages = async () => {
    setImageListState({ loading: true, data: null })
    try {
      const response = await s3Client.send(new ListObjectsV2Command({
        Bucket: bucket,
        Prefix: prefix,
      }))

      const imageList = await Promise.all(
        response.Contents?.filter(({ Size }) => !!Size).map(async ({ Key }) => ({
          key: Key,
          url: await getSignedUrl(s3Client, new GetObjectCommand({
            Bucket: bucket,
            Key
          }), { expiresIn: 3000 })
        })) ?? []
      )

      setImageListState({
        loading: false,
        data: imageList
      })
    } catch (error) {
      if (error instanceof Error) {
        setImageListState({
          loading: false,
          data: null,
          error
        })
      }
    }
  }

  const uploadImages = async (files: FileList) => {
    const uploadedImages: string[] = []
    const failedImages: UploadImageError[] = []
    setUploadImageState({
      loading: true,
      uploadedImages,
      failedImages
    })
    try {
      for (const file of files) {
        try {
          await s3Client.send(new PutObjectCommand({
            Bucket: bucket,
            Key: prefix ? `${prefix}/${file.name}` : file.name,
            Body: file,
            ACL: 'public-read'
          }))

          uploadedImages.push(file.name)
        } catch (error) {
          if (error instanceof Error) {
            failedImages.push({
              filename: file.name,
              error
            })
          }
        }
      }
      setUploadImageState({
        loading: false,
        uploadedImages,
        failedImages
      })
    } catch (error) {
      if (error instanceof Error) {
        setUploadImageState({
          loading: false,
          uploadedImages: [],
          failedImages: [],
          error,
        })
        return false
      }
    }
    return true
  }

  const deleteImage = async (key: string) => {
    try {
      await s3Client.send(new DeleteObjectCommand({
        Bucket: bucket,
        Key: key
      }))
    } catch (error) {
      if (error instanceof Error) {
        return false
      }
    }
    setDeleteImageState({
      loading: false
    })
    return true
  }

  const deleteAllImages = async () => {
    try {
      const { Deleted } = await s3Client.send(new DeleteObjectsCommand({
        Bucket: bucket,
        Delete: {
          Objects: []
        }
      }))
    } catch (error) {

    }
  }

  useEffect(() => {
    fetchImages()
  }, [bucket, prefix])

  return {
    imageState,
    imageListState,
    uploadImageState,
    deleteImageState,
    fetchImage,
    fetchImages,
    deleteImage,
    uploadImages
  }
}

export default useS3