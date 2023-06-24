import { useState } from 'react'
import { BASE_URL_API } from '../shared/cs-constants'

export type Param = Record<string, string | undefined> | null
export type Query = Record<string, string> | null

interface ApiResponse<T> {
  data: T | null,
  loading: boolean,
  error: string | null,
  fetchData: (e: string, p?: Param, q?: Query) => Promise<void>
}

const useFetch = <T>(): ApiResponse<T> => {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const fetchData = async (endpoint: string, param: Param = null, query: Query = null) => {
    try {
      setLoading(true)
      const queryString = query && Object.entries(query).length ?`?${new URLSearchParams(query).toString()}` : ''
      const newEndpoint = param ? endpoint.replace(/:([a-zA-Z]+)/g, (match, key) => param[key] || match) : endpoint
      const url = `${BASE_URL_API}${newEndpoint}${queryString}`
      const res = await fetch(url)
      
      if (!res.ok) {
        throw new Error(`${res.status} ${res.statusText}`)
      }
      const data: T = await res.json()
      setError(null)
      setData(data)
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === 'Failed to fetch') {
          setError('No se pudo conectar al servidor. Por favor, revise su conexión de red.')
        } else {
          setError(error.message)
          setError(error.message)
        }
        setData(null)
      }
    } finally {
      setLoading(false)
    }
  }

  return { data, loading, error, fetchData }
}

export default useFetch