import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Flex,
  Text,
  useToast,
  VStack
} from '@chakra-ui/react';
import { AddIcon, DeleteIcon, SearchIcon } from '@chakra-ui/icons';
import { useCallback, useEffect, useState } from 'react';

import DataList from '../DataList';
import DataListItem from '../DataListItem';
import { InputChangeEvent } from '../../shared/typeAlias';
import useFetch from '../../hooks/useFetch';
import { useParams } from 'react-router-dom';
import AddLocationMenu from './AddLocationMenu';

export interface LocationParams extends Record<string, string> {
  cityId: string
}

export interface Location {
  id: number,
  name: string,
  cityId: number
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
  const { data, loading, error, refresh } = useFetch<Location[]>("/cities/:id/locations", { id: cityId })
  const nextId = Math.max(...(data?.map(e=>e.id) ?? []))
  const handleSearch = useCallback(({ target: { value } }: InputChangeEvent) => {
    setSearchValue(value)
  }, [])
  const handleFilter = useCallback(filterCallback(searchValue), [searchValue])
  
  useEffect(() => {
    refresh()
    if (error) {
      toast({
        title: error,
        description: "Ocurrió un error obteniendo las instalaciones. Por favor, inténtalo más tarde.",
        position: 'bottom-right',
        status: 'error',
        isClosable: true
      })
    }
  }, [cityId, error])
  return (
    <Card>
      <CardBody>
        <VStack align='stretch'>
          <AddLocationMenu nextId={nextId + 1}/>
          {
            data &&
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
          }
        </VStack>
      </CardBody>
    </Card>
  )
}

export default LocationDetailView