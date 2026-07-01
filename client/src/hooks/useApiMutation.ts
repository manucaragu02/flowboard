import { useState } from 'react'
import api from '../api/axios'

export function useApiMutation<T>(method: 'post' | 'patch' | 'delete', url: string) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const mutate = async (data?: unknown): Promise<T> => {
    setLoading(true)
    setError(null)
    try {
      let response
      if (method === 'post') {
        response = await api.post(url, data)
      } else if (method === 'patch') {
        response = await api.patch(url, data)
      } else {
        response = await api.delete(url)
      }
      return response.data
    } catch (err) {
      setError(err as Error)
      throw err
    } finally {
      setLoading(false)
    }
  }

  return { mutate, loading, error }
}
