import { Link, useParams } from 'react-router-dom'
import { useRef, useState, type BaseSyntheticEvent } from 'react'
import Modal from '../components/Modal'
import FormField from '../components/FormField'
import Card from '../components/Card'
import { useApiMutation } from '../hooks/useApiMutation'
import { useFetch } from '../hooks/useFetch'
import Form from '../components/Form'
import Grid from '../components/Grid'

interface Project {
  id: string
  name: string
  tasks: { id: string }[]
}

function WorkspaceDetail() {
  const { workspaceId } = useParams()
  const modalRef = useRef<HTMLDialogElement>(null)
  const [projectName, setProjectName] = useState('')

  const {
    data: projects,
    loading: loadingPojects,
    error: fetchError,
    refetch,
  } = useFetch<Project>(`/api/workspaces/${workspaceId}/projects`)

  if (fetchError) console.error(fetchError)

  function toggleDialog() {
    if (!modalRef.current) return
    if (modalRef.current.hasAttribute('open')) {
      modalRef.current.close()
    } else {
      modalRef.current.showModal()
    }
  }

  const {
    mutate,
    loading: creatingProject,
    error: mutateError,
  } = useApiMutation<Project>('post', `/api/workspaces/${workspaceId}/projects`)

  const handleSubmit = async (e: BaseSyntheticEvent) => {
    e.preventDefault()
    try {
      await mutate({ name: projectName })
      refetch()
      toggleDialog()
    } catch {
      console.error(mutateError)
    }
  }

  return (
    <div>
      <h1>Workspace Detail</h1>
      <button onClick={toggleDialog} disabled={creatingProject}>
        Nuevo proyecto
      </button>
      <Modal ref={modalRef} toggleDialog={toggleDialog}>
        <Form onSubmit={(e) => handleSubmit(e)} submitLabel="Crear proyecto">
          <FormField
            id="nombre"
            label="Nombre"
            type="text"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
          />
        </Form>
      </Modal>
      {loadingPojects ? (
        <p>Cargando...</p>
      ) : projects.length > 0 ? (
        <Grid>
          {projects.map((item) => (
            <Link key={item.id} to={`/projects/${item.id}`}>
              <Card key={item.id} name={item.name}>
                <p>
                  {item.tasks.length} tarea{item.tasks.length !== 1 ? 's' : ''}
                </p>
              </Card>
            </Link>
          ))}
        </Grid>
      ) : (
        <p>Este workspace no tiene ningún proyecto</p>
      )}
    </div>
  )
}

export default WorkspaceDetail
