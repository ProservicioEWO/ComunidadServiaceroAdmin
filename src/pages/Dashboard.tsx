import AppContextProvider from '../contexts/AppContextProvider';
import MainLayout from '../shared/MainLayout';
import useAuthContext from '../hooks/useAuthContext';

const Dashboard = () => {
  const {
    authSessionData
  } = useAuthContext()

  return (
    <AppContextProvider sessionData={authSessionData}>
      <MainLayout />
    </AppContextProvider>
  )
}

export default Dashboard