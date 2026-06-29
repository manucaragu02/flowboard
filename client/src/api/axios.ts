import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
})

// Incluir token en las peticiones de axios
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error),
)

// Refrescar el token de acceso
api.interceptors.response.use(
  (response) => {
    return response
  },
  async (error) => {
    if (error.response && error.response.status === 401 && !error.config.url.includes('/auth/refresh')) {
      console.error('Response error :: ', error.response)

      try {
        const refresh_token_url = '/api/auth/refresh'
        const response = await api.post(refresh_token_url, {
          refreshToken: localStorage.getItem('refreshToken'),
        })

        const newAccesToken = response.data.accessToken

        localStorage.setItem('accessToken', newAccesToken)

        const originalRequest = error.config
        originalRequest.headers.Authorization = `Bearer ${newAccesToken}`
        return await axios(originalRequest)
      } catch (refreshError) {
        window.location.href = '/login'

        return await Promise.reject(refreshError)
      }
    }
    return Promise.reject(error)
  },
)

export default api
