import { useState } from "react"
import { BASE_URL_API } from "../shared/cs-constants"

const useUpdateData = <T>() => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const updateData = async (endpoint: string, param: Record<string, string | undefined> | null = null, data: T) => {
    setLoading(true)
    try {
      const newEndpoint = param ? endpoint.replace(/:([a-zA-Z]+)/g, (match, key) => param[key] || match) : endpoint
      const response = await fetch(`${BASE_URL_API}${newEndpoint}`, {
        method: 'PATCH',
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      })

      if (!response.ok) {
        throw new Error("Error al actualizar los datos")
      }
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message)
      }
    } finally {
      setLoading(false)
    }
  }

  return { loading, error, updateData }
}

export default useUpdateData