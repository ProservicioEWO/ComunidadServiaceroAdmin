import {
  AuthenticationDetails,
  CognitoUser,
  CognitoUserAttribute,
  CognitoUserPool,
  CognitoUserSession
} from "amazon-cognito-identity-js";
import AuthFailureError from "../errors/AuthFailureError";

export interface UserAttrs {
  user: CognitoUser,
  attrs: CognitoUserAttribute
}

const userPool = new CognitoUserPool({
  UserPoolId: import.meta.env.VITE_COGNITO_POOL_ID,
  ClientId: import.meta.env.VITE_COGNITO_CLIENT_ID
})

const login = (username: string, password: string) => {
  const cognitoUser = new CognitoUser({
    Username: username,
    Pool: userPool
  });

  const authenticationDetails = new AuthenticationDetails({
    Username: username,
    Password: password
  });

  return new Promise<CognitoUserSession>((resolve, reject) => {
    cognitoUser.authenticateUser(authenticationDetails, {
      onSuccess: result => {
        resolve(result)
      },
      onFailure: err => {
        let message = ""
        console.warn(err.name)
        switch (err.name) {
          case 'NotAuthorizedException':
            message = "Las credenciales proporcionadas no son válidas o no están autorizadas para acceder."
            break
          case 'UserNotFoundException':
            message = "No se encontró un usuario con la información proporcionada."
            break
          case 'InvalidParameterException':
            message = "Se proporcionó un parámetro no válido en la solicitud."
            break
          case 'UserNotConfirmedException':
            message = "El usuario aún no ha confirmado su cuenta. Por favor, verifica tu correo electrónico para confirmar la cuenta."
            break
          case 'CodeMismatchException':
            message = "El código proporcionado no coincide con el código esperado. Por favor, verifica el código e inténtalo nuevamente."
            break
          case 'PasswordResetRequiredException':
            message = "Es necesario restablecer la contraseña antes de poder autenticarse. Por favor, sigue las instrucciones para restablecer tu contraseña."
            break
          case 'UserLambdaValidationException':
            message = "Las credenciales proporcionadas no son válidas o no están autorizadas para acceder."
            break
          default:
            message = "Ha ocurrido un error durante la autenticación. Por favor, intenta nuevamente más tarde."
            break
        }
        reject(new Error(message))
      }
    })
  })
}

const logout = () => {
  return new Promise<boolean>((success) => {
    const cognitoUser = userPool.getCurrentUser()
    if (cognitoUser) {
      cognitoUser.signOut()
    }
    success(true)
  })
}

const accessToken = () => {
  try {
    const currentUser = userPool.getCurrentUser()

    if (!currentUser) {
      throw new AuthFailureError()
    }
    return new Promise<string>((resolve, reject) => {
      currentUser.getSession((err: any, session: CognitoUserSession) => {
        if (err) {
          reject(err)
        } else {
          const accessToken = session.getAccessToken().getJwtToken()
          resolve(accessToken)
        }
      })
    })
  } catch (error) {
    return Promise.reject(error)
  }
}

const idToken = () => {
  try {
    const currentUser = userPool.getCurrentUser()
    if (!currentUser) {
      throw new AuthFailureError()
    }

    return new Promise<string>((resolve, reject) => {
      currentUser.getSession((err: any, session: CognitoUserSession) => {
        if (err) {
          reject(err)
        } else {
          const idToken = session.getIdToken().getJwtToken()
          resolve(idToken)
        }
      })
    })
  } catch (error) {
    return Promise.reject(error)
  }
}

const isAuthenticated = () => {
  try {
    const cognitoUser = userPool.getCurrentUser()

    if (!cognitoUser) {
      return Promise.resolve(false)
    }

    return new Promise<boolean>((resolve, reject) => {
      cognitoUser.getSession((err: any, session: CognitoUserSession) => {
        if (err) {
          reject(err)
        } else if (!session.isValid()) {
          resolve(false)
        } else {
          resolve(true)
        }
      })
    })
  } catch (error) {
    return Promise.reject(false)
  }
}

const getUserId = () => {
  return new Promise<string | null>((resolve, reject) => {
    try {
      const current = userPool.getCurrentUser()
      if (current) {
        current.getSession((err: any, session: CognitoUserSession) => {
          if (err) {
            reject(err)
            return
          }

          current.getUserAttributes((err, attrs) => {
            if (err) {
              reject(err)
            } else {
              const sub = attrs?.find(e => e.Name === 'sub')
              if (!sub) {
                reject(new Error("No se pudo encontrar el id de usuario"))
                return
              }

              resolve(sub.Value)
            }
          })
        })
      } else {
        resolve(null)
      }
    } catch (error) {
      reject(error)
    }
  })
}


export default {
  login,
  logout,
  isAuthenticated,
  accessToken,
  idToken,
  getUserId
}