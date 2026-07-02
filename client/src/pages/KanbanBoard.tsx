import { useParams } from 'react-router-dom'
import { useFetch } from '../hooks/useFetch'
import Modal from '../components/Modal'
import FormField from '../components/FormField'
import { useRef, useState, type BaseSyntheticEvent } from 'react'
import { useApiMutation } from '../hooks/useApiMutation'
import type { Task } from '../types/Task'
import KanbanRow from '../components/KanbanRow'
import Form from '../components/Form'

function KanbanBoard() {
  const { projectId } = useParams()
  const modalRef = useRef<HTMLDialogElement>(null)
  const [taskName, setTaskName] = useState('')
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [selectedStatus, setSelectedStatus] = useState<'TODO' | 'IN_PROGRESS' | 'DONE'>(selectedTask?.status ?? 'TODO')

  const {
    data: tasks,
    loading: loadingTasks,
    error: fetchError,
    refetch,
  } = useFetch<Task>(`/api/projects/${projectId}/tasks`)

  if (fetchError) console.error(fetchError)

  const pendantTasks = tasks.filter((t) => {
    return t.status === 'TODO'
  })
  const ongoingTasks = tasks.filter((t) => {
    return t.status === 'IN_PROGRESS'
  })
  const completedTasks = tasks.filter((t) => {
    return t.status === 'DONE'
  })

  function toggleDialog() {
    if (!modalRef.current) return
    if (modalRef.current.hasAttribute('open')) {
      modalRef.current.close()
      setSelectedTask(null)
    } else {
      modalRef.current.showModal()
    }
  }

  function openTaskModal(task: Task | null) {
    setSelectedTask(task)
    setTaskName(task?.title ?? '')
    toggleDialog()
  }

  const {
    mutate: createTask,
    loading: creatingTask,
    error: createError,
  } = useApiMutation<Task>('post', `/api/projects/${projectId}/tasks`)

  const handleCreate = async (e: BaseSyntheticEvent) => {
    e.preventDefault()
    try {
      await createTask({ title: taskName })
      refetch()
      toggleDialog()
    } catch {
      console.error(createError)
    }
  }

  const {
    mutate: updateTask,
    loading: updatingTask,
    error: updateError,
  } = useApiMutation<Task>('patch', `/api/projects/${projectId}/tasks/${selectedTask?.id}`)

  const handleUpdate = async (e: BaseSyntheticEvent) => {
    e.preventDefault()
    try {
      await updateTask({ title: taskName, status: selectedStatus })
      refetch()
      toggleDialog()
    } catch {
      console.error(updateError)
    }
  }

  return (
    <div>
      <h1>Kanban Board</h1>
      <button onClick={toggleDialog}>Nueva tarea</button>
      <Modal ref={modalRef} toggleDialog={toggleDialog}>
        {selectedTask !== null ? (
          <Form onSubmit={(e) => handleUpdate(e)} submitLabel="Modificar tarea" loading={updatingTask}>
            <FormField
              id="nombre"
              label="Nombre"
              type="text"
              placeholder="Nombre de la tarea..."
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
            />
            <select id="estado" onChange={(e) => setSelectedStatus(e.target.value as 'TODO' | 'IN_PROGRESS' | 'DONE')}>
              <option value="TODO">Pendiente</option>
              <option value="IN_PROGRESS">En proceso</option>
              <option value="DONE">Completada</option>
            </select>
          </Form>
        ) : (
          <Form onSubmit={(e) => handleCreate(e)} submitLabel="Crear tarea" loading={creatingTask}>
            <FormField
              id="nombre"
              label="Nombre"
              type="text"
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
            />
          </Form>
        )}
      </Modal>
      {loadingTasks ? (
        <p>Cargando...</p>
      ) : (
        <>
          <KanbanRow title="Tareas pendientes" tasks={pendantTasks} openTaskModal={openTaskModal} />
          <KanbanRow title="Tareas en proceso" tasks={ongoingTasks} openTaskModal={openTaskModal} />
          <KanbanRow title="Tareas completadas" tasks={completedTasks} openTaskModal={openTaskModal} />
        </>
      )}
    </div>
  )
}

export default KanbanBoard
