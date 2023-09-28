import { useEffect, useState } from "react"
import { SessionStatus } from "../shared/SessionStatus"
import jwtDecode, { JwtPayload } from 'jwt-decode'
import { getUNIX } from "../shared/utils"

export interface UseRedirectHookOptions {
  accessToken: string
}

const useRedirect = ({ accessToken }: UseRedirectHookOptions) => {
  const [status, setStatus] = useState<SessionStatus>(SessionStatus.VALID_SESSION)

  const checkStatus = () => {
    const payload = jwtDecode(accessToken, { header: false }) as JwtPayload
    const expire = payload.exp

    return setInterval(() => {
      if (expire) {
        setStatus(
          expire <= getUNIX() ?
            SessionStatus.INVALID_SESSION :
            SessionStatus.VALID_SESSION
        )
      }
    }, 1000)
  }

  useEffect(() => {
    const iid = checkStatus()
    return () => {
      clearInterval(iid)
    }
  }, [accessToken])

  return {
    status
  }
}

export default useRedirect