import {
  HStack,
  Image,
  Text,
  useToast
} from '@chakra-ui/react';
import { useCallback, useEffect, useState } from 'react';

import { NavLink } from 'react-router-dom';
import useDeleteData from '../../hooks/useDelete';
import useFetch from '../../hooks/useFetch';
import { InputChangeEvent } from '../../shared/typeAlias';
import DataList from '../DataList';
import DataListItem from '../DataListItem';

export interface UsersDataResponse {
  id: number,
  name: string,
  lastname: string,
  enterprise: {
    id: number,
    logo: string
  }
}

const filterCallback = (search: string) => {
  const regex = new RegExp(`^${search}[\\s\\w]*`)
  return (data: UsersDataResponse) => (
    search === "" || regex.test(data.name) || regex.test(data.lastname)
  )
}

const UsersListView = () => {
  const toast = useToast()
  const [dataList, setDataList] = useState<UsersDataResponse[]>([])
  const [search, setSearch] = useState("")
  const { loading: deleteLoading, error: deleteError, deleteData } = useDeleteData()
  const { data, loading, error } = useFetch<UsersDataResponse[]>("/users?_expand=enterprise")
  const handleSearch = useCallback(({ target: { value } }: InputChangeEvent) => setSearch(value), [])
  const handleFilter = useCallback(filterCallback(search), [search])
  const handleDeleteUser = useCallback(async (itemId: string | number) => {
    await deleteData("/users", itemId)
    if (!deleteError) {
      const newDataList = dataList.filter(e => e.id !== itemId)
      setDataList(newDataList)
    }
  }, [dataList, deleteError])

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
    if (deleteError) {
      toast({
        title: deleteError,
        description: "Ocurrió un error. Por favor, inténtalo más tarde.",
        position: 'bottom-right',
        status: 'error',
        isClosable: true
      })
    }
  }, [error, deleteError, data])

  return (
    <DataList<UsersDataResponse>
      list={dataList}
      isLoading={loading}
      error={error}
      searchValue={search}
      onFilter={handleFilter}
      onSearch={handleSearch}>
      {
        ({ id, name, lastname, enterprise: { logo } }) => (
          <DataListItem
            key={id}
            loading={deleteLoading}
            onDelete={() => handleDeleteUser(id)}>
            <NavLink to={`${id}`}>
              {
                ({ isActive }) => (
                  <HStack>
                    <Image src={logo} boxSize="8" />
                    <Text
                      style={
                        isActive ? {
                          fontWeight: 'bold',
                          textDecoration: 'underline'
                        } : undefined
                      }>
                      {`${name} ${lastname}`}
                    </Text>
                  </HStack>
                )
              }
            </NavLink>
          </DataListItem>
        )
      }
    </DataList>
  )
}

export default UsersListView