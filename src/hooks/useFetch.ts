import { useEffect, useState } from 'react'
import { BASE_URL_API } from '../shared/cs-constants'

interface ApiResponse<T> {
  data: T | null,
  refresh: () => void
  loading: boolean,
  error: string | null
}

const useFetch = <T>(endpoint: string, param: Record<string, string | undefined> | null = null, query: Record<string, string> | null = null): ApiResponse<T> => {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const fetchData = async () => {
    try {
      const queryString = query && Object.entries(query).length ?`?${new URLSearchParams(query).toString()}` : ''
      const newEndpoint = param ? endpoint.replace(/:([a-zA-Z]+)/g, (match, key) => param[key] || match) : endpoint
      const url = `${BASE_URL_API}${newEndpoint}${queryString}`
      //console.log(url);
      const res = await fetch(url)
      if (!res.ok) {
        throw new Error(`${res.status} ${res.statusText}`)
      }
      const data: T = await res.json()
      setData(data)
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message)
      }
    } finally {
      setLoading(false)
    }
  }

  const refresh = () => {
    setLoading(true)
    fetchData()
  }

  useEffect(() => {
    fetchData()
  }, [])

  return { data, loading, error, refresh }
}

export default useFetch