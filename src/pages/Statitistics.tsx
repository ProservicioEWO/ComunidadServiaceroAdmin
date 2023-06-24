import Chart from 'react-apexcharts';
import CountUp from 'react-countup';
import { ApexOptions } from 'apexcharts';
import {
  Box,
  Card,
  CardBody,
  CardHeader,
  Divider,
  GridItem,
  Heading,
  HStack,
  Icon,
  SimpleGrid,
  Text,
  VStack
} from '@chakra-ui/react';
import { CSBuilding } from '../icons/CSIcons';
import { SVGComponent } from '../shared/typeAlias';

const StatCard = ({ bg, title, icon }: { bg: string, title: string, icon: SVGComponent | undefined }) => {
  return (
    <Box color="white" bg={bg} borderRadius="lg" p="2" shadow="md">
      <VStack align="start" justify="center">
        <HStack>
          <Icon as={icon} />
          <Text p='3'>{title}</Text>
        </HStack>
        <Divider />
        <Text fontSize="6xl" fontWeight="bold">
          <CountUp end={100} duration={1} />
        </Text>
      </VStack>
    </Box>
  )
}

const Statitistics = () => {
  const data: { options: ApexOptions, series: ApexAxisChartSeries | ApexNonAxisChartSeries } = {
    options: {
      chart: {
        id: "basic-bar",
      },
      xaxis: {
        categories: [1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998, 1999]
      },
    },
    series: [
      {
        name: "series-1",
        data: [30, 40, 45, 50, 49, 60, 70, 91]
      }
    ]
  }

  const statsInfo = [
    {
      title: "Instalaciones",
      color: "#23fc73",
      icon: CSBuilding
    },
    {
      title: "Programas",
      color: "#ffbf00"
    },
    {
      title: "Galería",
      color: "#ff6347"
    },
    {
      title: "Calendario",
      color: "#2373fc"
    }
  ]

  return (
    <VStack w="full" align="stretch" spacing={4}>
      <SimpleGrid columns={4} spacing={4}>
        {
          statsInfo.map(({ title, color, icon }) => (
            <StatCard bg={color} title={title} icon={icon} />
          ))
        }
        <GridItem colSpan={3}>
          <Card>
            <CardHeader>
              <Heading size='lg'>Entradas por usuario</Heading>
            </CardHeader>
            <CardBody>
              <Chart options={data.options} series={data.series} type="line" />
            </CardBody>
          </Card>
        </GridItem>
        <Card>
          <CardHeader>
            <Heading size='lg'>Algún titulo</Heading>
          </CardHeader>
          <CardBody>
            {/* <Chart options={data.options} series={data.series} type="donut" /> */}
          </CardBody>
        </Card>
      </SimpleGrid>
    </VStack>
  )
}

export default Statitistics