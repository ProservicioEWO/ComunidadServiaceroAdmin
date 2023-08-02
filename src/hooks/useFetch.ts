import { useState } from 'react'
import { BASE_URL_API } from '../shared/cs-constants'

export type Param = Record<string, string | undefined> | null
export type Query = Record<string, string | string[]> | null

export interface FetchOptions {
  param?: Param
  query?: Query
  jwt: string
}

export interface ApiResponse<T> {
  data: T | null,
  loading: boolean,
  error: string | null,
  fetchData: (e: string, fetchOptions: FetchOptions) => Promise<void>
}

const queryConverter = (record: Query) => (
  Object.fromEntries(
    Object.entries(record ?? {}).map(([key, value]) => {
      if (typeof value === 'string') {
        return [key, value];
      } else if (Array.isArray(value)) {
        return [key, value.join(',')];
      }
      return [key, ''];
    })
  )
)

const useFetch = <T>(): ApiResponse<T> => {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = async (endpoint: string, { jwt, param, query }: FetchOptions) => {
    try {
      setLoading(true)
      setError(null)

      const queryString = query &&
        Object.entries(query).length ? `?${new URLSearchParams(queryConverter(query)).toString()}` : ''
      const newEndpoint = param ? endpoint.replace(/:([a-zA-Z]+)/g, (match, key) => param[key] || match) : endpoint
      const url = `${BASE_URL_API}${newEndpoint}${queryString}`
      const init = {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${jwt}`
        }
      } as RequestInit

      const res = await fetch(url, init)

      if (!res.ok) {
        throw new Error(`${res.status} ${res.statusText}`)
      }
      const data: T = await res.json()
      setData(data)
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === 'Failed to fetch') {
          setError('No se pudo conectar al servidor. Por favor, revise su conexión de red.')
        } else {
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