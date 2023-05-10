import Header from '../components/Header';
import Navbar from '../components/Navbar';
import NavbarButton from '../components/NavbarButton';
import useAppHeaderContext from '../hooks/useAppHeaderContext';
import { BASE_URL_IMG, VIEW_PADDING } from './cs-constants';
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
import { Outlet } from 'react-router-dom';
import { NotAllowedIcon } from '@chakra-ui/icons';

const MainLayout = () => {
  const { icon, title } = useAppHeaderContext()
  return (
    <HStack h="100vh" bg='gray.200' overflow='hidden'>
      <Navbar logo={<Image src={`${BASE_URL_IMG}/cs_sm.png`} />} logoHref='/admin'>
        <NavbarButton href="users" icon={CSUsers} text="Usuarios" />
        <NavbarButton href="locations" icon={CSBuilding} text="Instalaciones" />
        <NavbarButton href="courses" icon={CSTeacher} text="Cursos" />
        <NavbarButton href="gallery" icon={CSGallery} text="Galería" />
        <NavbarButton href="calendar" icon={CSCalendar} text="Calendario" />
        <NavbarButton href="statistics" icon={CSChart} text="Estadisticas" />
      </Navbar>
      <Box w='full' h='full' bg='cream.50' overflow="auto">
        <VStack p={VIEW_PADDING} spacing="5">
          <Header icon={icon.get ?? NotAllowedIcon} text={title.get} />
          <Outlet />
        </VStack>
      </Box>
    </HStack>
  )
}

export default MainLayout