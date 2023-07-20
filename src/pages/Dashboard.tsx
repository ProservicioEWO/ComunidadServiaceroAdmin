import { useEffect, useState } from "react"
import AppContextProvider from "../contexts/AppContextProvider"
import useAuthContext from "../hooks/useAuthContext"
import MainLayout from "../shared/MainLayout"

const Dashboard = () => {
  const { accessToken } = useAuthContext()
  const [currentAccessToken, setCurrentAccessToken] = useState<string | null>("")

  return (
    <AppContextProvider accessToken={accessToken}>
      <MainLayout />
    </AppContextProvider>
  )
}

export default Dashboard