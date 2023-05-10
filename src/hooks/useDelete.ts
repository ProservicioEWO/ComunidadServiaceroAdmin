import { useState } from "react"
import { BASE_URL_API } from "../shared/cs-constants"

const useDeleteData = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const deleteData = async (endpoint: string, id: string | number) => {
    setLoading(true)
    try {
      const response = await fetch(`${BASE_URL_API}${endpoint}/${id}`, {
        method: 'DELETE',
        headers: {
          "Content-Type": "application/json",
        }
      })
      if (!response.ok) {
        throw new Error(`${response.status} ${response.statusText}`)
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

  return { loading, error, deleteData }
}

export default useDeleteData