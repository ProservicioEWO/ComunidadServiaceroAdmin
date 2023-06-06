import { useContext } from "react"
import { AppContext } from "../contexts/AppContextProvider"

const useAppContext = () => {
  const appContext = useContext(AppContext)
  if(!appContext){
    throw new Error("appContext must be used wthin an AppContextProvider")
  }

  return appContext
}

export default useAppContext