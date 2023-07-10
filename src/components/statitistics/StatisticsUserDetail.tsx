import useAppContext from '../../hooks/useAppContext';
import {
  Card,
  CardBody,
  Divider,
  Heading,
  HStack,
  Spinner,
  Text,
  VStack
} from '@chakra-ui/react';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Log } from '../../models/Log';
import { StatsParams } from './StatitisticsDetails';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const StatisticsUserDetail = () => {
  const [username, setUsername] = useState("")
  const [logsList, setLogsList] = useState<Log[] | undefined>([])
  const { users, logs } = useAppContext()
  const { userId } = useParams<StatsParams>()

  useEffect(() => {
    const userLogs = logs.list?.filter(e => e.user.id === userId)
    const user = users.get?.find(e => e.id === userId)

    setLogsList(userLogs)
    if (user) {
      setUsername(user.username)
    }
  }, [userId])

  return (
    <>
      {
        logs.state.loading ?
          <Card>
            <CardBody>
              <HStack>
                <Spinner />
                <Text>Cargando</Text>
              </HStack>
            </CardBody>
          </Card> :
          <VStack
            w="98%"
            rounded='md'
            align='stretch'
            bg='facebook.600'
            p={5}
            pt={8}
            shadow="lg"
            spacing={5}>
            <Heading
              color='white'
              fontSize='2xl'>{username} - Resumen de actividad</Heading>
            <DataTable<Log[]>
              resizableColumns
              paginator
              rows={5}
              rowsPerPageOptions={[5, 10, 20]}
              value={logsList}
              emptyMessage="No se encontraron registros."
              tableStyle={{ minWidth: '50rem', borderRadius: "0.4rem 0.4rem 0 0", overflow: 'hidden' }}>
              {
                [
                  { field: 'id', header: 'ID' },
                  { field: 'date', header: 'Fecha' },
                  { field: 'module.name', header: 'Módulo' }
                ].map((col, i) => (
                  <Column
                    resizeable
                    sortable
                    filter
                    key={i}
                    filterPlaceholder={`Buscar por ${col.header.toLowerCase()}`}
                    field={col.field}
                    filterField={col.field}
                    header={col.header} />
                ))
              }
            </DataTable>
          </VStack>
      }
    </>
  )
}

export default StatisticsUserDetail