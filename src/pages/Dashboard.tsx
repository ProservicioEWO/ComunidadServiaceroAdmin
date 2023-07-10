import AppContextProvider from "../contexts/AppContextProvider"
import MainLayout from "../shared/MainLayout"

const Dashboard = () => {
  return (
    <AppContextProvider>
      <MainLayout/>
    </AppContextProvider>
  )
}

export default Dashboard