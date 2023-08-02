import { Navigate } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';
import useAuthContext from '../hooks/useAuthContext';

export interface AuthorizeProps {
  children: JSX.Element
}

const Authorize = ({ children }: AuthorizeProps) => {
  const {
    isBusy,
    authSessionData: { isAuthenticated }
  } = useAuthContext()

  if (isBusy) {
    return (
      <LoadingSpinner />
    )
  }

  return (
    !isAuthenticated ?
      <Navigate to='/login' /> :
      children
  )
}

export default Authorize