import { Link, useParams } from 'react-router-dom'
import api from '../api/axios'
import { useEffect, useRef, useState, type BaseSyntheticEvent } from 'react'
import ProjectCard from '../components/ProjectCard'
import Modal from '../components/Modal'
import FormField from '../components/FormField'
import axios from 'axios'

interface Project {
  id: string
  name: string
  tasks: { id: string }[]
}

function WorkspaceDetail() {
  const { workspaceId } = useParams()
  const [projects, setProjects] = useState<Project[]>([])

  useEffect(() => {
    api
      .get(`/api/workspaces/${workspaceId}/projects`)
      .then(({ data }) => {
        setProjects(data)
      })
      .catch((error) => {
        console.log(error)
      })
  }, [workspaceId])

  const modalRef = useRef<HTMLDialogElement>(null)
  const [projectName, setProjectName] = useState('')

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
      .post(`/api/workspaces/${workspaceId}/projects`, { name: projectName })
      .then(({ data }) => {
        console.log('Workspace creado:', data)
        setProjects((prev) => [...prev, data])
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
      <h1>Workspace Detail</h1>
      <button onClick={toggleDialog}>Nuevo proyecto</button>
      <Modal ref={modalRef} toggleDialog={toggleDialog}>
        <form onSubmit={(e) => handleSubmit(e)}>
          <FormField
            id="nombre"
            label="Nombre"
            type="text"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
          />
          <button type="submit">Crear proyecto</button>
        </form>
      </Modal>
      {projects.length > 0 ? (
        projects.map((item) => (
          <Link key={item.id} to={`/projects/${item.id}`}>
            <ProjectCard name={item.name} taskCount={item.tasks.length} />
          </Link>
        ))
      ) : (
        <p>Este workspace no tiene ningún proyecto</p>
      )}
    </div>
  )
}

export default WorkspaceDetail
