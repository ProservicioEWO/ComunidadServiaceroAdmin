import { NotAllowedIcon } from '@chakra-ui/icons';
import {
  Box,
  HStack,
  Image,
  VStack
} from '@chakra-ui/react';
import { Outlet } from 'react-router-dom';
import Header from '../components/Header';
import Navbar from '../components/Navbar';
import NavbarButton from '../components/NavbarButton';
import useAppContext from '../hooks/useAppContext';
import useAppHeaderContext from '../hooks/useAppHeaderContext';
import {
  CSBuilding,
  CSCalendar,
  CSChart,
  CSGallery,
  CSHome,
  CSTeacher,
  CSUsers
} from '../icons/CSIcons';
import Loading from '../pages/Loading';
import { BASE_URL_IMG_CDN, VIEW_PADDING } from './cs-constants';

const MainLayout = () => {
  const { starting } = useAppContext()
  const { icon, title } = useAppHeaderContext()
  return (
    starting ?
      <Loading /> :
      <HStack id="main-layout" h="100vh" bg='gray.200' overflow='hidden'>
        <Navbar logo={<Image src={`${BASE_URL_IMG_CDN}/cs_sm.png`} />} logoHref='/'>
          <NavbarButton href="landing" icon={CSHome} text="Cónocenos" />
          <NavbarButton href="users" icon={CSUsers} text="Usuarios" />
          <NavbarButton href="locations" icon={CSBuilding} text="Instalaciones" />
          <NavbarButton href="courses" icon={CSTeacher} text="Programas" />
          <NavbarButton href="gallery" icon={CSGallery} text="Galería" />
          <NavbarButton href="calendar" icon={CSCalendar} text="Calendario" />
          <NavbarButton href="statistics" icon={CSChart} text="Estadisticas" />
        </Navbar>
        <Box w='full' h='full' bg='cream.50' overflowX="hidden" overflowY="auto">
          <VStack p={VIEW_PADDING} spacing="5">
            <Header icon={icon.get ?? NotAllowedIcon} text={title.get} />
            <Outlet />
          </VStack>
        </Box>
      </HStack>
  )
}

export default MainLayout