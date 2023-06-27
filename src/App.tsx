import Calendar from './pages/Calendar';
import Courses from './pages/Courses';
import EventsDetailView from './components/gallery/EventsDetailView';
import Gallery from './pages/Gallery';
import SectionIndex from './components/SectionIndex';
import Locations from './pages/Locations';
import MainLayout from './shared/MainLayout';
import NotFound from './pages/NotFound';
import Statitistics from './pages/Statitistics';
import useAppHeaderContext from './hooks/useAppHeaderContext';
import UserDetailView from './components/users/UserDetailView';
import Users from './pages/Users';
import { CourseDetailView, CourseSectionDetailView } from './components/courses';
import {
  CSBuilding,
  CSCalendar,
  CSChart,
  CSGallery,
  CSTeacher,
  CSUsers
} from './icons/CSIcons';
import { LocationDetailView } from './components/locations';
import { Route, Routes, useLocation, useParams } from 'react-router-dom';
import { useEffect } from 'react';
import StatitisticsDetails, { StatsParams } from './components/statitistics/StatitisticsDetails';
import { Text } from '@chakra-ui/react';


const App = () => {
  const { userId } = useParams<StatsParams>()
  const { pathname } = useLocation()
  const { icon, title } = useAppHeaderContext()
  const page = pathname.match(/^\/admin\/(?<section>\w+)/)?.groups?.section ?? ""
  const pageInfo = {
    admin: { title: "Inicio" },
    users: { title: "Usuarios", icon: CSUsers },
    locations: { title: "Instalaciones", icon: CSBuilding },
    courses: { title: "Programas", icon: CSTeacher },
    gallery: { title: "Galería", icon: CSGallery },
    calendar: { title: "Calendario", icon: CSCalendar },
    statistics: { title: "Estadísticas", icon: CSChart }
  }[page]

  useEffect(() => {
    title.set(pageInfo?.title ?? "")
    icon.set(pageInfo?.icon ?? null)
  }, [pathname, title, icon])

  return (
    <Routes>
      <Route path="admin" element={<MainLayout />}>
        <Route path="users" element={<Users />}>
          <Route path=':userId' element={<UserDetailView />} />
        </Route>
        <Route path='locations' element={<Locations />}>
          <Route index element={<SectionIndex message='Selecciona una ciudad para administrar las instalaciones' />} />
          <Route path=":cityId" element={<LocationDetailView />} />
        </Route>
        <Route path='courses' element={<Courses />}>
          <Route index element={<SectionIndex message='Selecciona una ciudad para administrar los programas' />} />
          <Route path=':cityId?' element={<CourseSectionDetailView />}>
            <Route index element={<SectionIndex message='Selecciona una seccion' />} />
            <Route path=':sectionId?' element={<CourseDetailView />} />
          </Route>
        </Route>
        <Route path='gallery' element={<Gallery />}>
          <Route index element={<SectionIndex message='Selecciona un evento para administrar la galeria de imágenes' />} />
          <Route path=':eventId' element={<EventsDetailView />} />
        </Route>
        <Route path='calendar' element={<Calendar />} />
        <Route path='statistics' element={<Statitistics />}>
          <Route path=':statType' element={<StatitisticsDetails />}>
            <Route index path=':userId' element={<Text>Detalle de log usuario</Text>}/>
          </Route>
        </Route>
        <Route path='*' element={<NotFound />} />
      </Route>
    </Routes>
  )
}

export default App
