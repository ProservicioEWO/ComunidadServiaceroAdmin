import {
  createContext,
  ReactNode,
  useCallback, useEffect, useState
} from 'react';
import AuthService from '../services/AuthService';

export interface AuthSessionData {
  isAuthenticated: boolean
  userId: string | null
  accessToken: string | null
  idToken: string | null
}

export interface AuthContextValue {
  authSessionData: AuthSessionData
  isBusy: boolean
  hasError: string | null
  signIn: (username: string, password: string) => Promise<void>
  signOut: () => Promise<void>
}

export const AuthContext = createContext<AuthContextValue>({
  authSessionData: {
    isAuthenticated: false,
    accessToken: null,
    idToken: null,
    userId: null,
  },
  hasError: null,
  isBusy: false,
  signIn: async () => { },
  signOut: async () => { }
})

const AuthContextProvider = ({ children }: { children: ReactNode }) => {
  const [isBusy, setIsBusy] = useState(true)
  const [hasError, setHasError] = useState<string | null>(null)

  const [userId, setUserId] = useState<string | null>(null)
  const [accessToken, setAccessToken] = useState<string | null>(null)
  const [idToken, setIdToken] = useState<string | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)

  const signIn = useCallback(async (username: string, password: string) => {
    try {
      setIsBusy(true)
      setHasError(null)

      const userSession = await AuthService.login(username, password)

      setIdToken(userSession.getIdToken().getJwtToken())
      setAccessToken(userSession.getAccessToken().getJwtToken())
      setIsAuthenticated(userSession.isValid())

      const userId = await AuthService.getUserId()

      setUserId(userId)
    } catch (error) {
      const _error = error as Error
      if (_error.message === "Incorrect username or password.") {
        setHasError("Usuario o contraseña incorrectos.")
      } else {
        setHasError(`${_error.name} ${_error.message}`)
      }
    } finally {
      setIsBusy(false)
    }
  }, [])

  const signOut = useCallback(async () => {
    try {
      setIsBusy(true)
      setHasError(null)
      const res = await AuthService.logout()
      if (!res) {
        throw new Error("Ocurrio un error al tratar de cerrar la sesión.")
      }
      setIdToken(null)
      setAccessToken(null)
      setIsAuthenticated(false)
    } catch (error) {
      setHasError((error as Error).message)
    } finally {
      setIsBusy(false)
    }
  }, [])

  useEffect(() => {
    (async () => {
      setIsBusy(true)
      setHasError(null)

      try {
        if (await AuthService.isAuthenticated()) {
          const userId = await AuthService.getUserId()

          setIdToken(await AuthService.idToken())
          setAccessToken(await AuthService.accessToken())
          setIsAuthenticated(true)
          setUserId(userId)
        }
      } catch (error) {
        setHasError((error as Error).message)
      } finally {
        setIsBusy(false)
      }
    })()
  }, [])

  return (
    <AuthContext.Provider value={{
      isBusy,
      hasError,
      signIn,
      signOut,
      authSessionData: {
        accessToken, idToken, isAuthenticated, userId
      }
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContextProvider