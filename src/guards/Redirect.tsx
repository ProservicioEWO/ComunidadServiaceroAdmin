import { useEffect } from "react"
import { Navigate } from "react-router-dom"
import useAuthContext from "../hooks/useAuthContext"

export interface RedirectProps {
  children: JSX.Element
  redir?: string
}

const Redirect = ({ children}: RedirectProps) => {
  const { current } = useAuthContext()

  useEffect(() => {
    console.log(current)
  }, [])

  return (
    current.cognitoUser ?
      <Navigate to='/admin' /> :
      children
  )
}

export default Redirect