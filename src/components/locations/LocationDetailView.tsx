import DataList from '../DataList';
import DataListItem from '../DataListItem';
import useFetch from '../../hooks/useFetch';
import { AddLocationMenu } from '../locations';
import {
  Card,
  CardBody,
  Text,
  useToast,
  VStack
} from '@chakra-ui/react';
import { DeleteIcon, SearchIcon } from '@chakra-ui/icons';
import { InputChangeEvent } from '../../shared/typeAlias';
import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Location } from '../../models/Location';
import useAppContext from '../../hooks/useAppContext';
import { fromCognitoIdentityPool } from '@aws-sdk/credential-providers';
import useS3 from '../../hooks/useS3';
import { AddLocationFormValues } from './AddLocationMenu';
import useCustomToast from '../../hooks/useCustomToast';
import useInsertData from '../../hooks/useInsertData';
import useDeleteData from '../../hooks/useDelete';
import useAuthContext from '../../hooks/useAuthContext';

export interface LocationParams extends Record<string, string> {
  siteId: string
}

const filterCallback = (search: string) => {
  const regex = new RegExp(`^${search.toUpperCase()}[\\s\\w]*`)
  return (data: Location) => (
    search === "" || regex.test(data.name.toUpperCase())
  )
}

const LocationDetailView = () => {
  const { authSessionData: { accessToken, idToken } } = useAuthContext()
  const { newId } = useAppContext()
  const { successToast, errorToast } = useCustomToast()
  const [searchValue, setSearchValue] = useState("")
  const { siteId } = useParams<LocationParams>()
  const {
    error: insertError,
    loading: insertLoading,
    insertData
  } = useInsertData<Location>()
  const {
    error: deleteError,
    loading: deleteLoading,
    deleteData
  } = useDeleteData()
  const {
    data,
    loading,
    error,
    fetchData
  } = useFetch<Location[]>()
  const { uploadImages, deleteImage, uploadImageState } = useS3({
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
  }, 'cs-static-res', 'images/locations')


  const handleSearch = useCallback(({ target: { value } }: InputChangeEvent) => {
    setSearchValue(value)
  }, [])

  const handleFilter = useCallback(filterCallback(searchValue), [searchValue])

  const handleAddLocation = async ({ name, id, file }: AddLocationFormValues) => {
    const newLoc = {
      id,
      name,
      siteId,
      imageKey: file[0].name,
      videoKey: ''
    } as Location

    const ok = await insertData("/locations", newLoc, {
      jwt: accessToken!,
      method: 'PUT'
    })

    if (ok) {
      const okS3 = await uploadImages(file)
      if (okS3) {
        successToast("Se agregó la nueva instalación con éxito")
        fetchData("/sites/:id/locations", {
          jwt: accessToken!,
          param: { id: siteId }
        })
      }
    }
  }

  const handleDelete = async (id: string, imageKey: string) => {
    const ok = await deleteData(`/locations`, id, {
      jwt: accessToken!
    })
    if (ok) {
      const _ok = await deleteImage(imageKey)
      if (_ok) {
        fetchData("/sites/:id/locations", {
          jwt: accessToken!,
          param: { id: siteId }
        })
        successToast("El elemento se borro la instalación con éxito.")
      }
    }
  }

  useEffect(() => {
    fetchData("/sites/:id/locations", {
      jwt: accessToken!,
      param: { id: siteId }
    })
  }, [siteId])

  useEffect(() => {
    if (error) {
      errorToast("Ocurrió un error obteniendo las instalaciones. Por favor, inténtalo más tarde.")
    }

    if (deleteError) {
      errorToast("Ocurrió un error borrando la instalación. Por favor, inténtalo más tarde.")
    }

    if (insertError) {
      errorToast("Ocurrió un error insertando la instalación. Por favor, inténtalo más tarde.")
    }
  }, [deleteError, insertError, error])

  return (
    <Card>
      <CardBody>
        <VStack align='stretch'>
          <AddLocationMenu
            isDisabled={loading}
            nextId={newId}
            loading={insertLoading || uploadImageState.loading}
            onAdd={handleAddLocation} />
          <DataList<Location>
            list={data}
            isLoading={loading || uploadImageState.loading}
            options={{
              placeholder: "Buscar instalación",
              searchIcon: <SearchIcon />
            }}
            onSearch={handleSearch}
            onFilter={handleFilter}
            searchValue={searchValue}>
            {
              ({ id, name, imageKey }) => (
                <DataListItem
                  key={id}
                  loading={deleteLoading}
                  onDelete={async () => await handleDelete(id, imageKey)}
                  options={{
                    icon: <DeleteIcon color="red.500" />
                  }}>
                  <Text>{name}</Text>
                </DataListItem>
              )
            }
          </DataList>
        </VStack>
      </CardBody>
    </Card>
  )
}

export default LocationDetailView