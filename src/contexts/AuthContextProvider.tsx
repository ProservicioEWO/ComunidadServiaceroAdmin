import { Amplify, Auth } from 'aws-amplify';
import { CognitoUser, CognitoUserSession } from 'amazon-cognito-identity-js';
import {
  createContext,
  ReactNode,
  useEffect,
  useMemo,
  useState
} from 'react';

Amplify.configure({
  Auth: {
    identityPoolId: import.meta.env.VITE_COGNITO_IG_ID,
    userPoolId: import.meta.env.VITE_COGNITO_POOL_ID,
    clientId: import.meta.env.VITE_COGNITO_CLIENT_ID,
    userPoolWebClientId: import.meta.env.VITE_COGNITO_CLIENT_ID,
    storage: window.sessionStorage
  }
})

export enum AuthStatus {
  FAIL = 0,
  OK = 1
}

export interface AuthResponse {
  status: AuthStatus
  error?: string
}

export interface AuthState {
  isSigningIn: boolean,
  isSigningOut: boolean
}

export interface AuthError {
  signIn: string | null,
  signOut: string | null
}

export interface UserSession {
  cognitoUser: CognitoUser | null
  userLoading: boolean
  userError: string | null
}

export interface AccessTokenState {
  tokenLoading: boolean
  tokenError: string | null
  token: string | null
}

export interface AuthContextValue {
  signIn: (username: string, password: string) => Promise<AuthResponse>
  signOut: () => Promise<void>
  current: UserSession
  accessToken: AccessTokenState
  authState: AuthState,
  authError: AuthError
}

export const AuthContext = createContext<AuthContextValue>({
  signIn: async () => ({ status: AuthStatus.FAIL }),
  signOut: async () => { },
  current: {
    cognitoUser: null,
    userError: null,
    userLoading: true
  },
  accessToken: {
    tokenError: null,
    tokenLoading: true,
    token: null
  },
  authState: {
    isSigningIn: false,
    isSigningOut: false
  },
  authError: {
    signIn: null,
    signOut: null
  }
})

const AuthContextProvider = ({ children }: { children: ReactNode }) => {
  const [isSigningOut, setIsSigningOut] = useState(false)
  const [isSigningIn, setIsSigningIn] = useState(false)
  const [signInError, setSignInError] = useState<string | null>(null)
  const [signOutError, setSignOutError] = useState<string | null>(null)

  const [tokenLoading, setTokenLoading] = useState<boolean>(true)
  const [tokenError, setTokenError] = useState<string | null>(null)
  const [token, setToken] = useState<string | null>(null)

  const [cognitoUser, setCognitoUser] = useState<CognitoUser | null>(null)
  const [userLoading, setUserLoading] = useState<boolean>(true)
  const [userError, setUserError] = useState<string | null>(null)

  const value = useMemo<AuthContextValue>(() => ({
    current: {
      cognitoUser,
      userLoading,
      userError
    },
    accessToken: {
      tokenError,
      tokenLoading,
      token
    },
    signIn: async (username, password): Promise<AuthResponse> => {
      let authResponse: AuthResponse = { status: AuthStatus.FAIL }
      try {
        setSignInError(null)
        setIsSigningIn(true)
        const user = await Auth.signIn(username, password) as CognitoUser

        authResponse = {
          status: AuthStatus.OK
        }
      } catch (error) {
        const _error = error as Error
        if (_error.message === "Incorrect username or password.") {
          setSignInError("Usuario o contraseña incorrectos.")
        } else {
          setSignInError(`${_error.name} ${_error.message}`)
        }

        setIsSigningIn(false)

        authResponse = {
          status: AuthStatus.FAIL,
          error: (error as Error).message
        }
      } finally {
        setIsSigningIn(false)
        return authResponse
      }
    },
    signOut: async () => {
      try {
        setIsSigningOut(true)
        await Auth.signOut()
      } catch (error) {
        setSignOutError((error as Error).message)
      } finally {
        setIsSigningOut(false)
      }
    },
    authState: {
      isSigningOut,
      isSigningIn
    },
    authError: {
      signIn: signInError,
      signOut: signOutError
    }
  }), [
    isSigningOut,
    isSigningIn,
    signInError,
    signOutError,
    token,
    tokenLoading,
    tokenError,
    cognitoUser,
    userLoading,
    userError
  ])

  useEffect(() => {
    const getAccessToken = async () => {
      try {
        setTokenLoading(true)
        setTokenError(null)
        const _session = await Auth.currentSession() as CognitoUserSession
        console.log(_session)
        setToken(_session.getAccessToken().getJwtToken())
      } catch (err) {
        setTokenError((err as Error).message)
      } finally {
        setTokenLoading(false)
      }
    }

    const getUser = async () => {
      try {
        setUserLoading(true)
        setUserError(null)
        const _user = await Auth.currentAuthenticatedUser() as CognitoUser
        console.log(_user)
        setCognitoUser(_user)
      } catch (err) {
        setUserError((err as Error).message)
      } finally {
        setUserLoading(false)
      }
    }

    getUser()
    getAccessToken()
  }, [])

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContextProvider