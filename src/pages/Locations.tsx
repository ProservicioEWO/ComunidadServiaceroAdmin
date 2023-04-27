import useFetch from '../hooks/useFetch';
import useInsertData from '../hooks/useInsertData';
import { AddLocationForm, LocationMenuList, LocationMenuListItem } from '../components/locations';
import {
  Box,
  HStack,
  useToast,
  VStack
} from '@chakra-ui/react';
import { NewLocationValue } from '../components/locations/AddLocationForm';
import { Outlet, useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import useDeleteData from '../hooks/useDelete';
import { LocationParams } from '../components/locations/LocationDetailView';

export interface CityDataResponse {
  id: number,
  alias: string,
  name: string,
  count: number
}

export interface City {
  alias: string,
  name: string,
  count: number
}

const Locations = () => {
  const navigate = useNavigate()
  const { cityId } = useParams<LocationParams>()
  const toast = useToast()
  const { deleteData, loading: deleting, error: deleteError } = useDeleteData()
  const { insertData, loading: inserting, error: insertError } = useInsertData<City>()
  const { data, loading, error } = useFetch<CityDataResponse[]>("/cities")
  const [dataList, setDataList] = useState<CityDataResponse[]>([])
  const handleAdd = async (newLocation: NewLocationValue) => {
    await insertData("/cities", { ...newLocation, count: 0 })
    if (!insertError) {
      const newValues = { id: Math.max(...dataList.map(e => e.id)) + 1, count: 0 }
      setDataList([...dataList, { ...newValues, ...newLocation }])
      toast({ description: "Se creó la nueva ciudad con éxito", status: "success", isClosable: true })
    }
  }
  const handleDelete = async (id: string | number) => {
    await deleteData("/cities?_embed=locations", id)
    if (!deleteError) {
      const newDatalist = dataList.filter(e => e.id !== id)
      if (cityId && id === cityId) {
        navigate(`/admin/locations`)
      }
      setDataList(newDatalist)
      toast({ description: "Se eliminó ciudad con éxito", status: "success", isClosable: true })
    }
  }
  useEffect(() => {
    if (data) {
      setDataList(data)
    }
    if (error) {
      toast({
        title: error,
        description: "Ocurrió un error. Por favor, inténtalo más tarde.",
        position: 'bottom-right',
        status: 'error',
        isClosable: true
      })
    }

    if (insertError) {
      toast({
        title: error,
        description: "Ocurrió un error. Por favor, inténtalo más tarde.",
        position: 'bottom-right',
        status: 'error',
        isClosable: true
      })
    }
  }, [data, error, insertError])

  return (
    <HStack align="stretch" w="full">
      <VStack>
        <LocationMenuList<CityDataResponse>
          isLoading={loading}
          dataList={dataList} >
          {
            ({ id, name, alias, count }) => (
              <LocationMenuListItem
                counter={count}
                param={String(id)}
                text={name}
                isLoading={deleting}
                onDelete={() => handleDelete(id)} />
            )
          }
        </LocationMenuList>
        <AddLocationForm isLoading={inserting} onAdd={handleAdd} />
      </VStack>
      <Box w="full">
        {
          data && 
          !loading &&
          <Outlet />
        }
      </Box>
    </HStack>
  )
}

export default Locations