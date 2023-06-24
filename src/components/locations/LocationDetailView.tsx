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

export interface LocationParams extends Record<string, string> {
  cityId: string
}

const filterCallback = (search: string) => {
  const regex = new RegExp(`^${search.toUpperCase()}[\\s\\w]*`)
  return (data: Location) => (
    search === "" || regex.test(data.name.toUpperCase())
  )
}

const LocationDetailView = () => {
  const toast = useToast()
  const [searchValue, setSearchValue] = useState("")
  const { cityId } = useParams<LocationParams>()
  const {
    data,
    loading,
    error,
    fetchData
  } = useFetch<Location[]>()
  const { newId } = useAppContext()
  const handleSearch = useCallback(({ target: { value } }: InputChangeEvent) => {
    setSearchValue(value)
  }, [])
  const handleFilter = useCallback(filterCallback(searchValue), [searchValue])

  useEffect(() => {
    fetchData("/cities/:id/locations", { id: cityId })
  }, [cityId])

  useEffect(() => {
    if (error) {
      toast({
        title: error,
        description: "Ocurrió un error obteniendo las instalaciones. Por favor, inténtalo más tarde.",
        position: 'bottom-right',
        status: 'error',
        isClosable: true
      })
    }
  }, [error])

  return (
    <Card>
      <CardBody>
        <VStack align='stretch'>
          <AddLocationMenu
            isDisabled={loading}
            nextId={newId}
            cityId={cityId ?? ""}
            toData={data} />
          <DataList<Location>
            list={data}
            isLoading={loading}
            options={{
              placeholder: "Buscar instalación",
              searchIcon: <SearchIcon />
            }}
            onSearch={handleSearch}
            onFilter={handleFilter}
            searchValue={searchValue}>
            {
              ({ id, name }) => (
                <DataListItem
                  key={id}
                  loading={false}
                  onDelete={async () => { }}
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