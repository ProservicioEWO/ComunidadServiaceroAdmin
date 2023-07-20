import DataList from '../DataList';
import DataListItem from '../DataListItem';
import useAppContext from '../../hooks/useAppContext';
import useCustomToast from '../../hooks/useCustomToast';
import useDeleteData from '../../hooks/useDelete';
import { Box, HStack, Image, Text } from '@chakra-ui/react';
import { InputChangeEvent } from '../../shared/typeAlias';
import { NavLink, useNavigate, useParams } from 'react-router-dom';
import { useCallback, useEffect, useState } from 'react';
import { User } from '../../models/User';
import { UserDetailParams } from './UserDetailView';

const filterCallback = (search: string) => {
  const regex = new RegExp(`^${search}[\\s\\w]*`)
  return (data: User) => (
    search === "" || regex.test(data.name) || regex.test(data.lastname)
  )
}

const UsersListView = () => {
  const navigate = useNavigate()
  const [search, setSearch] = useState("")
  const { users } = useAppContext()
  const { userId } = useParams<UserDetailParams>()
  const { successToast, errorToast } = useCustomToast()
  const { loading: deleteLoading, error: deleteError, deleteData } = useDeleteData()
  const handleSearch = useCallback(({ target: { value } }: InputChangeEvent) => setSearch(value), [])
  const handleFilter = useCallback(filterCallback(search), [search])
  const handleDeleteUser = async (itemId: string | number) => {
    const ok = await deleteData("/users", itemId)
    if (ok) {
      const newDataList = users.get?.filter(e => e.id !== itemId)
      if (newDataList) {
        users.set([...newDataList])
        successToast("Se eliminó el usuario con éxito.")
        if (userId && String(itemId) === userId) {
          navigate(`/admin/users`)
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
      list={users.get}
      isLoading={users.state.loading}
      error={!!users.state.error}
      searchValue={search}
      onFilter={handleFilter}
      onSearch={handleSearch}>
      {
        ({ id, name, lastname, enterprise: { logo } }) => (
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
            }
          </DataListItem>
        )
      }
    </DataList>
  )
}

export default UsersListView