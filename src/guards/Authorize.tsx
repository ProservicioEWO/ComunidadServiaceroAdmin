import loginAnimation from '../../src/lotties/login_lottie.json';
import Lottie from 'lottie-react';
import useAuthContext from '../hooks/useAuthContext';
import { AbsoluteCenter, Box, VStack } from '@chakra-ui/react';
import { Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

export interface AuthorizeProps {
  children: JSX.Element
}

const Authorize = ({ children }: AuthorizeProps) => {
  const { current } = useAuthContext()

  useEffect(() => {
    console.log(current)
  }, [])

  return (
    !current.cognitoUser ?
      <Navigate to='/login' /> :
      children
  )
}

export default Authorize