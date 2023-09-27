import useAuthContext from '../../../hooks/useAuthContext';
import useFetch from '../../../hooks/useFetch';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Log } from '../../../models/Log';
import { useEffect, useState } from 'react';
import { Box, Center, HStack, Spinner, Text } from '@chakra-ui/react';
import './styles.css'

const LogList = () => {
  const [logList, setLogList] = useState<Log[]>([])
  const { authSessionData: { accessToken } } = useAuthContext()
  const { data, error, loading, fetchData } = useFetch<Log[]>()

  useEffect(() => {
    fetchData("/logs", {
      jwt: accessToken!,
      query: {
        _append: 'user',
        type: 'L'
      }
    })
  }, [])

  useEffect(() => {
    if (data) {
      setLogList(data.map(e => ({
        ...e,
        id: e?.user?.username ? e.id : "",
        user: {
          ...e.user,
          username: e?.user?.username ?? "(usuario eliminado)"
        }
      })))
    }
  }, [data])

  if (error) {
    return (
      <Box w="full">
        {error}
      </Box>
    )
  }

  return (
    <Box w="full">
      <Center>
        {
          loading ?
            <HStack>
              <Spinner />
              <Text>Cargando</Text>
            </HStack> :
            <DataTable<Log[]> value={logList} paginator rows={20} rowsPerPageOptions={[5, 10, 25, 50]} style={{ width: '100%' }}>
              <Column field="id" header="ID"></Column>
              <Column field="user.username" header="Usuario" filter filterField='user.username'></Column>
              <Column field="date" header="Fecha" sortable></Column>
            </DataTable>
        }
      </Center>
    </Box>
  )
}

export default LogList