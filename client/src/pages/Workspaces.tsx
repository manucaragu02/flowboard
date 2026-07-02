import { useRef, useState, type BaseSyntheticEvent } from 'react'
import Modal from '../components/Modal'
import FormField from '../components/FormField'
import { Link } from 'react-router-dom'
import Card from '../components/Card'
import { useApiMutation } from '../hooks/useApiMutation'
import { useFetch } from '../hooks/useFetch'
import Form from '../components/Form'
import Grid from '../components/Grid'

interface Workspace {
  id: string
  name: string
  members: { id: string }[]
  projects: { id: string }[]
}

function Workspaces() {
  const modalRef = useRef<HTMLDialogElement>(null)
  const [workspaceName, setWorkspaceName] = useState('')

  const {
    data: workspaces,
    loading: loadingWorkspaces,
    error: fetchError,
    refetch,
  } = useFetch<Workspace>('/api/workspaces')

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
    loading: creatingWorkspace,
    error: mutateError,
  } = useApiMutation<Workspace>('post', '/api/workspaces')

  const handleSubmit = async (e: BaseSyntheticEvent) => {
    e.preventDefault()
    try {
      await mutate({ name: workspaceName })
      refetch()
      toggleDialog()
    } catch {
      console.error(mutateError)
    }
  }

  return (
    <div>
      <h1>Workspaces</h1>
      <button onClick={toggleDialog} disabled={creatingWorkspace}>
        Nuevo workspace
      </button>
      <Modal ref={modalRef} toggleDialog={toggleDialog}>
        <Form onSubmit={(e) => handleSubmit(e)} submitLabel="Crear workspace">
          <FormField
            id="nombre"
            label="Nombre"
            type="text"
            value={workspaceName}
            onChange={(e) => setWorkspaceName(e.target.value)}
          />
        </Form>
      </Modal>
      {loadingWorkspaces ? (
        <p>Cargando...</p>
      ) : workspaces.length > 0 ? (
        <Grid>
          {workspaces.map((item) => (
            <Link key={item.id} to={`/workspaces/${item.id}`}>
              <Card key={item.id} name={item.name}>
                <p>
                  {item.members.length} miembro{item.members.length !== 1 ? 's' : ''}
                </p>
                <p>
                  {item.projects.length} proyecto{item.projects.length !== 1 ? 's' : ''}
                </p>
              </Card>
            </Link>
          ))}
        </Grid>
      ) : (
        <p>No tienes ningún workspace</p>
      )}
    </div>
  )
}

export default Workspaces
