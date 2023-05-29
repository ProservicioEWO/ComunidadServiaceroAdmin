import { Route, Routes, useLocation } from 'react-router-dom';

import Calendar from './pages/Calendar';
import Courses from './pages/Courses';
import Gallery from './pages/Gallery';
import { LocationDetailView } from './components/locations';
import Locations from './pages/Locations';
import MainLayout from './shared/MainLayout';
import NotFound from './pages/NotFound';
import Statitistics from './pages/Statitistics';
import UserDetailView from './components/users/UserDetailView';
import Users from './pages/Users';
import { CourseDetailView, CourseSectionDetailView } from './components/courses';
import { useEffect } from 'react';
import { CSUsers, CSBuilding, CSTeacher, CSGallery, CSCalendar, CSChart } from './icons/CSIcons';
import useAppHeaderContext from './hooks/useAppHeaderContext';
import EventsDetailView from './components/gallery/EventsDetailView';

const App = () => {
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
          <Route path=":cityId" element={<LocationDetailView />} />
        </Route>
        <Route path='courses' element={<Courses />}>
          <Route path=':cityId?' element={<CourseSectionDetailView />}>
            <Route path=':sectionId?' element={<CourseDetailView />} />
          </Route>
        </Route>
        <Route path='gallery' element={<Gallery />}>
          <Route path=':eventId' element={<EventsDetailView/>}/>
        </Route>
        <Route path='calendar' element={<Calendar />} />
        <Route path='statistics' element={<Statitistics />} />
      </Route>
      <Route path='*' element={<NotFound />} />
    </Routes>
  )
}

export default App
