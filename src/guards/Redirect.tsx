import useAuthContext from '../hooks/useAuthContext';
import { Navigate } from 'react-router-dom';
import { ProgressSpinner } from 'primereact/progressspinner';
import { useEffect } from 'react';
import { AbsoluteCenter, Box } from '@chakra-ui/react';
import Loading from '../components/LoadingSpinner';

export interface RedirectProps {
  children: JSX.Element
  redir?: string
}

const Redirect = ({ children }: RedirectProps) => {
  const {
    isBusy,
    authSessionData: { isAuthenticated }
  } = useAuthContext()

  if (isBusy) {
    return (
      <Loading />
    )
  }

  return (
    isAuthenticated ?
      <Navigate to='/' /> :
      children
  )
}

export default Redirect