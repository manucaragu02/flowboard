import { useEffect, useRef, useState, type BaseSyntheticEvent } from 'react'
import api from '../api/axios'
import WorkspaceCard from '../components/WorkspaceCard'
import Modal from '../components/Modal'
import FormField from '../components/FormField'
import axios from 'axios'
import { Link } from 'react-router-dom'

interface Workspace {
  id: string
  name: string
  members: { id: string }[]
  projects: { id: string }[]
}

function Workspaces() {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([])

  useEffect(() => {
    api
      .get('/api/workspaces')
      .then(({ data }) => {
        setWorkspaces(data)
      })
      .catch((error) => {
        console.log(error)
      })
  }, [])

  const modalRef = useRef<HTMLDialogElement>(null)
  const [workspaceName, setWorkspaceName] = useState('')

  function toggleDialog() {
    if (!modalRef.current) return
    if (modalRef.current.hasAttribute('open')) {
      modalRef.current.close()
    } else {
      modalRef.current.showModal()
    }
  }

  const handleSubmit = (e: BaseSyntheticEvent) => {
    e.preventDefault()

    if (modalRef.current?.hasAttribute('open')) {
      modalRef.current.close()
    }

    api
      .post('/api/workspaces', { name: workspaceName })
      .then(({ data }) => {
        console.log('Workspace creado:', data)
        setWorkspaces((prev) => [...prev, data])
      })
      .catch((error) => {
        if (axios.isAxiosError(error) && error.response) {
          console.error(error.response.data.error || 'Ocurrió un error')
        } else {
          console.error('Ocurrió un error')
        }
      })
  }

  return (
    <div>
      <h1>Workspaces</h1>
      <button onClick={toggleDialog}>Nuevo workspace</button>
      <Modal ref={modalRef} toggleDialog={toggleDialog}>
        <form onSubmit={(e) => handleSubmit(e)}>
          <FormField
            id="nombre"
            label="Nombre"
            type="text"
            value={workspaceName}
            onChange={(e) => setWorkspaceName(e.target.value)}
          />
          <button type="submit">Crear workspace</button>
        </form>
      </Modal>
      {workspaces.map((item) => (
        <Link key={item.id} to={`/workspaces/${item.id}`}>
          <WorkspaceCard name={item.name} memberCount={item.members.length} projectCount={item.projects.length} />
        </Link>
      ))}
    </div>
  )
}

export default Workspaces
