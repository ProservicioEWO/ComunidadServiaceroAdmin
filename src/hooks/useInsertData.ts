import { useState } from "react"
import { BASE_URL_API } from "../shared/cs-constants"

const useInsertData = <T>() => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string|null>(null)
  const insertData = async (endpoint: string, data: T) => {
    setLoading(true)
    try {
      const response = await fetch(`${BASE_URL_API}${endpoint}`, {
        method: 'POST',
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      })

      if(!response.ok){
        throw new Error("Error al instertar datos")
      }
    } catch (error) {
      if(error instanceof Error){
        setError(error.message)
      }
    } finally{
      setLoading(false)
    }
  }

  return {loading, error, insertData}
}

export default useInsertData