import {
  DeleteObjectCommand,
  DeleteObjectsCommand,
  ListObjectsV2Command,
  PutObjectCommand,
  S3Client,
  S3ClientConfig
} from '@aws-sdk/client-s3';
import { useEffect, useState } from 'react';

export interface UseS3Type {
  imageListState: ImageListState
  uploadImageState: UploadImageState
  deleteImageState: DeleteFileState
  fetchImages: () => Promise<void>
  deleteImage: (filename: string) => Promise<boolean>
  uploadImages: (files: FileList) => Promise<boolean>
}

export interface UploadImageError {
  filename: string
  error: Error
}

export interface ImageListState {
  loading: boolean
  data: string[] | null
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

  const fetchImages = async () => {
    setImageListState({ loading: true, data: null })
    try {
      const command = new ListObjectsV2Command({
        Bucket: bucket,
        Prefix: prefix,
      });

      const response = await s3Client.send(command);
      setImageListState({
        loading: false,
        data: response.Contents?.map(objeto => objeto.Key ?? "") ?? null
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
          const command = new PutObjectCommand({
            Bucket: bucket,
            Key: prefix ? `${prefix}/${file.name}` : file.name,
            Body: file,
            ACL: 'public-read'
          })

          await s3Client.send(command)
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
      const command = new DeleteObjectCommand({
        Bucket: bucket,
        Key: key
      })

      await s3Client.send(command)
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
      const command = new DeleteObjectsCommand({
        Bucket: bucket,
        Delete: {
          Objects: []
        }
      })
      const { Deleted } = await s3Client.send(command)
    } catch (error) {

    }
  }

  useEffect(() => {
    fetchImages()
  }, [bucket, prefix])

  return {
    imageListState,
    uploadImageState,
    deleteImageState,
    fetchImages,
    deleteImage,
    uploadImages
  }
}

export default useS3