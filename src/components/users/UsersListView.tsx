import DataList from '../DataList';
import DataListItem from '../DataListItem';
import useAppContext from '../../hooks/useAppContext';
import useAuthContext from '../../hooks/useAuthContext';
import useCustomToast from '../../hooks/useCustomToast';
import useDeleteData from '../../hooks/useDelete';
import {
  HStack,
  Image,
  Text,
  VStack
} from '@chakra-ui/react';
import { InputChangeEvent } from '../../shared/typeAlias';
import { NavLink, useNavigate, useParams } from 'react-router-dom';
import { useCallback, useEffect, useState } from 'react';
import { User } from '../../models/User';
import { UserDetailParams } from './UserDetailView';

const filterCallback = (search: string) => {
  const regex = new RegExp(`^${search.toUpperCase()}[\\s\\w]*`)
  return (data: User) => (
    regex.test(data.lastname.toUpperCase()) ||
    regex.test(data._lastname.toUpperCase()) ||
    regex.test(`${data.name} ${data.lastname} ${data._lastname}`.toUpperCase())
  )
}

const UsersListView = () => {
  const navigate = useNavigate()
  const { authSessionData: { accessToken } } = useAuthContext()
  const { users } = useAppContext()
  const [search, setSearch] = useState("")
  const { userId } = useParams<UserDetailParams>()
  const { successToast, errorToast } = useCustomToast()
  const { loading: deleteLoading, error: deleteError, deleteData } = useDeleteData()

  const handleSearch = useCallback(({ target: { value } }: InputChangeEvent) => setSearch(value), [])

  const handleFilter = useCallback(filterCallback(search), [search])

  const handleDeleteUser = async (itemId: string | number) => {
    const ok = await deleteData("/users", itemId, {
      jwt: accessToken!
    })

    if (ok) {
      const newDataList = users.get?.filter(e => e.id !== itemId)
      if (newDataList) {
        users.set([...newDataList])
        successToast("Se eliminó el usuario con éxito.")
        if (userId && String(itemId) === userId) {
          navigate(`/users`)
        }
      }
    }
  }

  useEffect(() => {
    if (users.state.error) {
      errorToast(users.state.error)
    }

    if (deleteError) {
      errorToast(deleteError)
    }
  }, [deleteError, users.state.error])

  return (
    <DataList<User>
      sortable
      sortAttribute="name"
      list={users.get}
      isLoading={users.state.loading}
      error={!!users.state.error}
      searchValue={search}
      onFilter={handleFilter}
      onSearch={handleSearch}>
      {
        ({ id, name, lastname, _lastname, username, enterprise: { logo } }) => (
          <DataListItem
            key={id}
            loading={deleteLoading}
            onDelete={() => handleDeleteUser(id)}>
            {
              <NavLink to={`${id}`}>
                {
                  ({ isActive }) => (
                    <HStack>
                      <Image src={logo} boxSize="8" />
                      <VStack align={"start"} spacing={0}>
                        <Text
                          style={
                            isActive ? {
                              fontWeight: 'bold',
                              textDecoration: 'underline',
                            } : undefined
                          }>
                          {`${name} ${lastname} ${_lastname}`}
                        </Text>
                        <Text fontSize={'smaller'} color="gray.500"> {`${username}`}</Text>
                      </VStack>

                    </HStack>
                  )
                }
              </NavLink>
            }
          </DataListItem>
        )
      }
    </DataList>
  )
}

export default UsersListView