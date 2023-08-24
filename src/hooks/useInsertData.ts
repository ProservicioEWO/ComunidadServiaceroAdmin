import { useState } from "react"
import { BASE_URL_API } from "../shared/cs-constants"

export interface InsertOptions {
  jwt: string
  method?: string
}

const useInsertData = <T>() => {
  const [loading, setLoading] = useState(false)
  const [response, setResponse] = useState<any | null>(null)
  const [error, setError] = useState<string | null>(null)
  const insertData = async (endpoint: string, data: T, { jwt, method = 'POST' }: InsertOptions) => {
    setLoading(true)
    setError(null)
    setResponse(null)
    let resposeBody: { id: string } | null = null
    try {
      const response = await fetch(`${BASE_URL_API}${endpoint}`, {
        method,
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${jwt}`
        },
        body: JSON.stringify(data)
      })
      
      if (!response.ok) {
        throw new Error("Error al instertar datos")
      }

      const json = await response.json() as { id: string }
      
      setResponse(json)
      resposeBody = json
    } catch (error) {
      setResponse(null)
      if (error instanceof Error) {
        if (error.message === 'Failed to fetch') {
          setError('No se pudo conectar al servidor. Por favor, revise su conexión de red.')
        } else {
          setError(error.message)
        }
      }
    } finally {
      setLoading(false)
    }
    return resposeBody
  }

  return { loading, error, response, insertData }
}

export default useInsertData