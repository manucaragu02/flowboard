import { useState, type SubmitEvent } from 'react'
import FormField from '../components/FormField'
import api from '../api/axios.ts'
import { useAuth } from '../hooks/useAuth.ts'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

function Register() {
  const { login } = useAuth()
  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPwd, setConfirmPwd] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (password !== confirmPwd) {
      setError('Las contraseñas no coinciden')
      return
    }

    try {
      await api.post('/api/auth/register', { name, email, password })
      const { data } = await api.post('/api/auth/login', { email, password })
      login(data.accessToken, data.refreshToken, data.userId)
      navigate('/workspaces')
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        setError(error.response.data.error || 'An error occurred')
      } else {
        setError('An error occurred')
      }
    }
  }

  return (
    <div>
      <h1>Registrarse</h1>
      <form onSubmit={handleSubmit}>
        <FormField
          id="name"
          label="Nombre"
          type="text"
          placeholder="Ingrese su nombre"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
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
        <FormField
          id="confirmPassword"
          label="Confirmar Contraseña"
          type="password"
          placeholder="Confirme su contraseña"
          value={confirmPwd}
          onChange={(e) => setConfirmPwd(e.target.value)}
        />

        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit">Registrarse</button>
      </form>
    </div>
  )
}

export default Register
