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
      if(!response.ok){
        throw new Error("Hubo un problema borrando el registro")
      }
    } catch (error) {
      if(error instanceof Error){
        setError(error.message)
      }
    } finally {
      setLoading(false)
    }
  }

  return { loading, error, deleteData }
}

export default useDeleteData