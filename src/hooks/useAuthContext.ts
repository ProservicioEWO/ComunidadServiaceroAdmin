import { useContext } from "react"
import { AuthContext } from "../contexts/AuthContextProvider"

const useAuthContext = () => {
  const authContext = useContext(AuthContext)
  if(!authContext){
    throw new Error("authContext must be used wthin an AuthContextProvider")
  }

  return authContext
}

export default useAuthContext