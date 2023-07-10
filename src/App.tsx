import { useEffect } from 'react';
import { Route, Routes, useLocation, useParams } from 'react-router-dom';
import { CourseDetailView, CourseSectionDetailView } from './components/courses';
import EventsDetailView from './components/gallery/EventsDetailView';
import { LocationDetailView } from './components/locations';
import SectionIndex from './components/SectionIndex';
import StatisticsUserDetail from './components/statitistics/StatisticsUserDetail';
import StatitisticsDetails, { StatsParams } from './components/statitistics/StatitisticsDetails';
import UserDetailView from './components/users/UserDetailView';
import useAppHeaderContext from './hooks/useAppHeaderContext';
import {
  CSBuilding,
  CSCalendar,
  CSChart,
  CSGallery,
  CSTeacher,
  CSUsers
} from './icons/CSIcons';
import Calendar from './pages/Calendar';
import Courses from './pages/Courses';
import Dashboard from './pages/Dashboard';
import Gallery from './pages/Gallery';
import Locations from './pages/Locations';
import Login from './pages/Login';
import NotFound from './pages/NotFound';
import Statitistics from './pages/Statitistics';
import Users from './pages/Users';


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
      <Route path="admin" element={<Dashboard />}>
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
          <Route index element={<SectionIndex message='Selecciona una categoria para ver las estadisticas.' />} />
          <Route path=':moduleId' element={<StatitisticsDetails />}>
            <Route index path=':userId' element={<StatisticsUserDetail />} />
          </Route>
        </Route>
        <Route path='*' element={<NotFound />} />
      </Route>
      <Route path='login' element={<Login />}></Route>
    </Routes>
  )
}

export default App
