import Chart from 'react-apexcharts';
import useAppContext from '../../hooks/useAppContext';
import useCustomToast from '../../hooks/useCustomToast';
import { ApexOptions } from 'apexcharts';
import {
  Card,
  CardBody,
  GridItem,
  Heading,
  SimpleGrid,
  VStack
} from '@chakra-ui/react';
import { Outlet, useNavigate } from 'react-router-dom';

export interface StatsParams extends Record<string, string | undefined> {
  statType?: string
  userId?: string
}

const StatitisticsDetails = () => {
  const navigate = useNavigate()
  const { users } = useAppContext()
  const { errorToast } = useCustomToast()
  const data: { options: ApexOptions, series: ApexAxisChartSeries | ApexNonAxisChartSeries } = {
    options: {
      chart: {
        id: "basic-bar",
        height: 100,
        events: {
          click(_e, chart, options) {
            const category = chart.w.config.xaxis.categories[options.dataPointIndex]
            const user = users.get?.find(({ user }) => user === category)
            if (user) {
              navigate(user.id)
            } else {
              errorToast("Ocurrió un problema obteniendo los detalles del usuario.")
            }
          }
        }
      },
      xaxis: {
        categories: users.get?.map(({ user }) => user)
      },
    },
    series: [
      {
        name: "visitas por usuario",
        color: "#a86fe8",
        data: Array(6).fill(10).map(e => Math.trunc(((Math.random() + 0.1) * e)))
      }
    ]
  }

  const data2: { options: ApexOptions, series: ApexAxisChartSeries | ApexNonAxisChartSeries } = {
    options: {
      chart: {
        id: 'basic-donut',
      },
      plotOptions: {
        bar: {
          horizontal: true,
          //labels: ["A", "B", "C", "D"]
        }
      }
    },

    series: [{
      name: "",
      data: Array(4).fill(10).map(e => Math.trunc(((Math.random() + 0.1) * e)))
    }],
  }

  return (
    <SimpleGrid columns={4} spacing={4}>
      <GridItem colSpan={4}>
        <Card>
          <CardBody>
            <VStack align='stretch'>
              <Heading size='lg'>Visitas por usuario</Heading>
              <Chart options={data.options} series={data.series} type="bar" />
            </VStack>
          </CardBody>
        </Card>
      </GridItem>
      {/* <GridItem colSpan={2}>
        <Card>
          <CardHeader>
            <Heading size='md'>Algún titulo</Heading>
          </CardHeader>
          <CardBody>
            <Chart options={data2.options} series={data2.series} type="bar" />
          </CardBody>
        </Card>
      </GridItem> */}
      <Outlet />
    </SimpleGrid>
  )
}

export default StatitisticsDetails