import CountUp from 'react-countup';
import {
  Box,
  Button,
  Divider,
  FormControl,
  FormLabel,
  HStack,
  Icon,
  Input,
  SimpleGrid,
  Spacer,
  Text,
  VStack
} from '@chakra-ui/react';
import {
  CSBuilding,
  CSCalendar,
  CSGallery,
  CSTeacher
} from '../icons/CSIcons';
import { NavLink, Outlet } from 'react-router-dom';
import { SVGComponent } from '../shared/typeAlias';

export interface StatCardProps {
  bg: string,
  title: string,
  icon: SVGComponent | undefined
  to: string
}

const StatCard = ({ bg, title, icon, to }: StatCardProps) => {
  return (
    <NavLink to={to}>
      <Box color="white" bg={bg} borderRadius="lg" p="4" shadow="md">
        <VStack>
          <HStack>
            <Icon as={icon} boxSize='8' />
            <Text p='1'>{title}</Text>
          </HStack>
          <Divider />
          <Text fontSize="6xl" fontWeight="bold">
            <CountUp end={(Math.random() + 0.1) * 23} duration={1} />
          </Text>
        </VStack>
      </Box>
    </NavLink>
  )
}

const Statitistics = () => {
  const statsInfo = [
    {
      title: "Instalaciones",
      color: "#75afff",
      to: 'locations',
      icon: CSBuilding
    },
    {
      title: "Programas",
      color: "#ffc64d",
      to: 'programs',
      icon: CSTeacher
    },
    {
      title: "Galería",
      color: "#ff704d",
      to: 'gallery',
      icon: CSGallery
    },
    {
      title: "Calendario",
      color: "#63d6d0",
      to: 'calendar',
      icon: CSCalendar
    }
  ]

  return (
    <VStack w="full" align="stretch" spacing={4}>
      <HStack alignItems='end' spacing={4}>
        <Spacer />
        <Box>
          <FormControl bg='white' variant='floating-date'>
            <FormLabel>Inicio:</FormLabel>
            <Input type='date' value={new Date("2023-06-01").toISOString().split("T")[0]} />
          </FormControl>
        </Box>
        <Box>
          <FormControl bg='white' variant='floating-date'>
            <FormLabel>Fin:</FormLabel>
            <Input type='date' value={new Date().toISOString().split("T")[0]} />
          </FormControl>
        </Box>
        <Button>Consultar</Button>
      </HStack>
      <SimpleGrid columns={4} spacing={4}>
        {
          statsInfo.map(({ title, color, icon, to }, i) => (
            <StatCard key={i} bg={color} title={title} icon={icon} to={to} />
          ))
        }
      </SimpleGrid>
      <Text>Visitas totales: <b>123</b></Text>
      <Outlet />
    </VStack>
  )
}

export default Statitistics