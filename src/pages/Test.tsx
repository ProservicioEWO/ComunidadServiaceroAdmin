import { API, Auth } from 'aws-amplify';
import { CognitoUser, CognitoUserSession } from 'amazon-cognito-identity-js';
import { useEffect, useState } from 'react';
import useAuthContext from '../hooks/useAuthContext';
import AppContextProvider from '../contexts/AppContextProvider';
import Test2 from './Test2';

const Test = () => {

  const { accessToken } = useAuthContext()
  const [currentAccessToken, setCurrentAccessToken] = useState<string | null>("")

  useEffect(() => {
    accessToken().then(setCurrentAccessToken)
  }, [])

  return (
    <AppContextProvider accessToken={currentAccessToken ?? ""}>
      <Test2/>
    </AppContextProvider>
  )
}

export default Test