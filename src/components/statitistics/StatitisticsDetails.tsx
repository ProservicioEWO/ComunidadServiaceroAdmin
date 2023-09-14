import Chart from 'react-apexcharts';
import useAppContext from '../../hooks/useAppContext';
import useCustomToast from '../../hooks/useCustomToast';
import { ApexChartData } from '../../shared/typeAlias';
import {
  Card,
  CardBody,
  Flex,
  GridItem,
  Heading,
  HStack,
  Icon,
  IconButton,
  SimpleGrid,
  Spacer,
  Spinner,
  Text,
  Tooltip,
  VStack
} from '@chakra-ui/react';
import { Log } from '../../models/Log';
import { Outlet, useNavigate, useParams } from 'react-router-dom';
import { QuestionOutlineIcon } from '@chakra-ui/icons';
import { SiMicrosoftexcel } from 'react-icons/si';
import { useEffect, useState } from 'react';

interface DataExcelRow {
  id: string
  username: string
  date: string
  module: string
  type: string
}

interface Grouped<T> extends Record<string, T[]> {
  [key: string]: T[]
}

export interface StatsParams extends Record<string, string | undefined> {
  moduleId?: string
  userId?: string
}

const StatitisticsDetails = () => {
  const navigate = useNavigate()
  const { errorToast } = useCustomToast()
  const { moduleId } = useParams<StatsParams>()
  const { users, logs, modules } = useAppContext()
  const [dataToExport, setDataToExport] = useState<DataExcelRow[]>([])
  const [data, setData] = useState<ApexChartData>({
    options: {
      chart: {
        id: "basic-bar",
        height: 100,
        events: {
          dataPointSelection(_e, chart, options) {
            const category = chart.w.config.xaxis.categories[options.dataPointIndex]
            const user = users.get?.find(({ username }) => username === category)
            if (user) {
              navigate(user.id)
            } else {
              errorToast("Ocurrió un problema obteniendo los detalles del usuario.")
            }
            (async () => {
              setTimeout(() => { }, 300)
            })()
          }
        }
      },
      plotOptions: {
        bar: {
          columnWidth: "40%"
        }
      },
      fill: {
        type: 'gradient',
        gradient: {
          shade: 'light',
          type: 'vertical',
          shadeIntensity: 0.5,
          gradientToColors: ['#8b83f7'], // Color final del gradiente
          inverseColors: true,
          opacityFrom: 1,
          opacityTo: 1,
          stops: [0, 100],
        },
      },
      xaxis: {
        categories: []
      }
    },
    series: [
      {
        name: "visitas por usuario",
        color: "#a86fe8",
        data: []
      }
    ]
  })

  const handleExport = async () => {
    const XLSX = await import("xlsx")
    const workbook = XLSX.utils.book_new()
    const worksheet = XLSX.utils.json_to_sheet(dataToExport)
    XLSX.utils.book_append_sheet(workbook, worksheet, 'visitas')
    XLSX.writeFile(workbook, 'visitas.xlsx')
  }

  useEffect(() => {
    logs.fetch({ moduleId, type: 'M' })
  }, [moduleId])

  useEffect(() => {
    const logList = logs.list?.filter(({ date }) => (
      new Date(date) >= new Date(logs.filters.value.dateStart) &&
      new Date(date) <= new Date(logs.filters.value.dateEnd)
    )) ?? []
    const dataExport = logList.map<DataExcelRow>(({ id, date, module, user }) => ({
      id: id,
      username: user.username,
      date: date,
      module: module.name,
      type: user.type
    }))

    setDataToExport(dataExport)

    const groupedLogList = logList.reduce<Grouped<Log>>(
      (result, log) => {
        if (!result[log.user.username]) {
          result[log.user.username] = []
        }
        result[log.user.username].push(log)
        return result
      }, {}
    )

    setData(prevData => ({
      ...prevData,
      options: {
        ...prevData.options,
        chart: {
          ...prevData.options.chart
        },
        xaxis: {
          ...prevData.options.xaxis,
          categories: Object.keys(groupedLogList)
        }
      },
      series: [
        {
          name: "visitas por usuario",
          color: "#a86fe8",
          data: Object.values(groupedLogList).map(e => e.length)
        }
      ]
    }))
  }, [logs.list])

  return (
    <VStack align="stretch">
      <SimpleGrid columns={4} spacing={4} mb="-20px">
        <GridItem colSpan={4}>
          <Card>
            <CardBody>
              {
                logs.state.loading ?
                  <HStack>
                    <Spinner />
                    <Text>Cargando</Text>
                  </HStack> :
                  !(data.series[0] as { data: any[] }).data.length ?
                    <Text>No hay datos disponibles para mostrar.</Text> :
                    <VStack align='stretch'>
                      <VStack alignItems='baseline'>
                        <HStack w='full'>
                          <Heading size='lg'>
                            Visitas por usuario ({modules?.filtered?.find(e => e.id === moduleId)?.name})
                          </Heading>
                          <Spacer />
                          <Tooltip
                            hasArrow
                            placement='start'
                            label='Exportar a Excel'>
                            <IconButton
                              size='lg'
                              colorScheme='green'
                              icon={<Icon fontSize='2xl' as={SiMicrosoftexcel} />}
                              aria-label={'export to Excel'}
                              onClick={handleExport} />
                          </Tooltip>
                        </HStack>
                        <HStack align='center' color='gray.500' fontSize='md'>
                          <QuestionOutlineIcon />
                          <Text>
                            Puedes hacer click en la barra del usuario para ver los detalles.
                          </Text>
                        </HStack>
                      </VStack>
                      <Chart
                        options={data.options}
                        series={data.series}
                        type="bar"
                        height={350} />

                    </VStack>
              }
            </CardBody>
          </Card>
        </GridItem>
      </SimpleGrid>
      <Flex w="full" justifyContent="center">
        <Outlet />
      </Flex>
    </VStack>
  )
}

export default StatitisticsDetails