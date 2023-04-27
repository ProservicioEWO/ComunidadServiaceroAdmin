import Header from '../components/Header';
import Navbar from '../components/Navbar';
import NavbarButton from '../components/NavbarButton';
import {
  Box,
  HStack,
  Image,
  VStack
} from '@chakra-ui/react';
import {
  CSBuilding,
  CSCalendar,
  CSChart,
  CSGallery,
  CSTeacher,
  CSUsers
} from '../icons/CSIcons';
import { Outlet, useLocation, useParams } from 'react-router-dom';
import { BASE_URL_IMG, VIEW_PADDING } from './cs-constants';
import { LocationParams } from '../components/locations/LocationDetailView';
import { UserDetailParams } from '../components/users/UserDetailView';

const MainLayout = () => {
  const { cityId } = useParams<LocationParams>()
  const { userId } = useParams<UserDetailParams>()
  const { pathname } = useLocation()
  const regexp = new RegExp(`\/(${cityId}|${userId})`, 'g')
  const section = pathname.replace(regexp, '').split("/").pop() ?? ""
  const getInfo = {
    "admin": { title: "Inicio" },
    "users": { title: "Usuarios", icon: CSUsers },
    "locations": { title: "Instalaciones", icon: CSBuilding },
    "courses": { title: "Programas", icon: CSTeacher },
    "gallery": { title: "Galería", icon: CSGallery },
    "calendar": { title: "Calendario", icon: CSCalendar },
    "statistics": { title: "Estadísticas", icon: CSChart }
  }[section]

  return (
    <HStack h="100vh" bg='gray.200' overflow='hidden'>
      <Navbar logo={<Image src={`${BASE_URL_IMG}/cs_sm.png`} />} logoHref='/admin'>
        <NavbarButton href="users" icon={CSUsers} />
        <NavbarButton href="locations" icon={CSBuilding} />
        <NavbarButton href="courses" icon={CSTeacher} />
        <NavbarButton href="gallery" icon={CSGallery} />
        <NavbarButton href="calendar" icon={CSCalendar} />
        <NavbarButton href="statistics" icon={CSChart} />
      </Navbar>
      <Box w='full' h='full' bg='cream.50' overflow="auto">
        <VStack p={VIEW_PADDING} spacing="5">
          <Header icon={getInfo?.icon} text={getInfo?.title ?? "Error"} />
          <Outlet />
        </VStack>
      </Box>
    </HStack>
  )
}

export default MainLayout