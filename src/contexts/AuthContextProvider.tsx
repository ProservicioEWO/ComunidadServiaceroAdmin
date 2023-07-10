import { Amplify, Auth } from 'aws-amplify';
import { CognitoUser } from 'amazon-cognito-identity-js';
import { createContext, ReactNode, useMemo, useState } from 'react';
import { User } from '../models/User';

Amplify.configure({
  Auth: {
    identityPoolId: "us-east-1:12c9962b-8973-4f7d-b1ce-b667f563ffac",
    region: "us-east-1",
    userPoolId: "us-east-1_oud83NQk8",
    clientId: "69qusms538vl3b99tovn5fr8mp",
    userPoolWebClientId: "69qusms538vl3b99tovn5fr8mp"
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
  token: {
    id?: string
    access?: string,
    refresh?: string
  }
  user: User | null
}

export interface AuthContextValue {
  currentUser: () => Promise<UserSession | null>
  signIn: (username: string, password: string) => Promise<AuthResponse>
  signOut: () => Promise<void>,
  authState: AuthState,
  authError: AuthError
}

export const AuthContext = createContext<AuthContextValue>({
  currentUser: async () => { return null },
  signIn: async () => ({ status: AuthStatus.FAIL }),
  signOut: async () => { },
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
  const [currentUser, setCurrentUser] = useState<UserSession | null>(null)
  const [isSigningOut, setIsSigningOut] = useState(false)
  const [isSigningIn, setIsSigningIn] = useState(false)
  const [signInError, setSignInError] = useState<string | null>(null)
  const [signOutError, setSignOutError] = useState<string | null>(null)
  const value = useMemo<AuthContextValue>(() => ({
    currentUser: async () => {
      const _authUser = await Auth.currentAuthenticatedUser()
      return _authUser
    },
    signIn: async (username, password): Promise<AuthResponse> => {
      let authResponse: AuthResponse = { status: AuthStatus.FAIL }
      try {
        setIsSigningIn(true)
        const user = await Auth.signIn(username, password) as CognitoUser
        const userSession = await Auth.userSession(user)
        const id = (await Auth.userAttributes(user)).find(e => e.Name === 'sub')?.Value!
        const res = await fetch(`/users/${id}`)
        if (!res.ok) {
          throw new Error("No se pudo iniciar sesión porque no se pudo obtener la información del usuario.")
        }
        const userData = await res.json() as User

        if (user) {
          setCurrentUser({
            token: {
              id: userSession.getIdToken().getJwtToken(),
              access: userSession.getAccessToken().getJwtToken(),
              refresh: userSession.getRefreshToken().getToken()
            },
            user: userData
          })
        }

        authResponse = {
          status: AuthStatus.OK
        }
      } catch (error) {
        if ((error as Error).message === "Incorrect username or password.") {
          setSignInError("Usuario o contraseña incorrectos.")
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
    currentUser,
    isSigningOut,
    isSigningIn,
    signInError,
    signOutError
  ])

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContextProvider