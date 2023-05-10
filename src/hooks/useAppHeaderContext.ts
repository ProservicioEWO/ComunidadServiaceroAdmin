import { useContext } from "react"
import { AppHeaderContext } from "../contexts/AppHeaderContextProvider"

const useAppHeaderContext = () => {
  const appContext = useContext(AppHeaderContext)
  if (!appContext) {
    throw new Error("AppHeaderContext must be used wthin an AppHeaderContextProvider")
  }
  return appContext
}

export default useAppHeaderContext