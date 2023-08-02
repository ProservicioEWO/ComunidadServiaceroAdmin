import { useState } from "react"
import { BASE_URL_API } from "../shared/cs-constants"

export interface UpdateOptions {
  jwt: string
}

const useUpdateData = <T>() => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const updateData = async (endpoint: string, param: Record<string, string | undefined> | null = null, data: T, { jwt }: UpdateOptions) => {
    setLoading(true)
    setError(null)
    try {
      const newEndpoint = param ? endpoint.replace(/:([a-zA-Z]+)/g, (match, key) => param[key] || match) : endpoint
      const response = await fetch(`${BASE_URL_API}${newEndpoint}`, {
        method: 'PATCH',
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${jwt}`
        },
        body: JSON.stringify(data)
      })

      if (!response.ok) {
        throw new Error("Error al actualizar los datos")
      }
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === 'Failed to fetch') {
          setError('No se pudo conectar al servidor. Por favor, revise su conexión de red.')
        } else {
          setError(error.message)
        }
      }
      return false
    } finally {
      setLoading(false)
    }
    return true
  }

  return { loading, error, updateData }
}

export default useUpdateData