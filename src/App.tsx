import { Route, Routes } from 'react-router-dom';

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

const App = () => {
  return (
    <Routes>
      <Route path="admin" element={<MainLayout />}>
        <Route path="users" element={<Users />}>
          <Route path=':userId' element={<UserDetailView />} />
        </Route>
        <Route path='locations' element={<Locations />}>
          <Route path=":cityId" element={<LocationDetailView />} />
        </Route>
        <Route path='courses' element={<Courses />} />
        <Route path='gallery' element={<Gallery />} />
        <Route path='calendar' element={<Calendar />} />
        <Route path='statistics' element={<Statitistics />} />
      </Route>
      <Route path='*' element={<NotFound />} />
    </Routes>
  )
}

export default App
