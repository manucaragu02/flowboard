import { useCallback, useEffect, useState } from 'react'
import api from '../api/axios'

export function useFetch<T>(url: string) {
  const [data, setData] = useState<T[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchData = useCallback(() => {
    api
      .get(url)
      .then(({ data }) => setData(data))
      .catch((err) => setError(err))
      .finally(() => setLoading(false))
  }, [url])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return { data, loading, error, refetch: fetchData }
}
