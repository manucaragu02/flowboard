import { useState, type SubmitEvent } from 'react'
import FormField from '../components/FormField'
import api from '../api/axios.ts'
import { useAuth } from '../hooks/useAuth.ts'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()

    api
      .post('/api/auth/login', { email, password })
      .then(({ data }) => {
        console.log('Login successful:', data)
        login(data.accessToken, data.refreshToken, data.userId)
        navigate('/workspaces')
      })
      .catch((error) => {
        if (axios.isAxiosError(error) && error.response) {
          setError(error.response.data.error || 'An error occurred')
        } else {
          setError('An error occurred')
        }
      })
  }

  return (
    <div>
      <h1>Iniciar Sesión</h1>
      <form onSubmit={handleSubmit}>
        <FormField
          id="email"
          label="Correo Electrónico"
          type="email"
          placeholder="Ingrese su correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <FormField
          id="password"
          label="Contraseña"
          type="password"
          placeholder="Ingrese su contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit">Iniciar Sesión</button>
      </form>
    </div>
  )
}

export default Login
