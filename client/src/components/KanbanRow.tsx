import type { Task } from '../types/Task'
import Card from './Card'
import Grid from './Grid'

interface Props {
  title: string
  tasks: Task[]
  openTaskModal: (task: Task | null) => void
}

function KanbanRow({ title, tasks, openTaskModal }: Props) {
  return (
    <div>
      <h2>{title}</h2>
      <Grid>
        {tasks.length > 0 ? (
          tasks.map((item) => <Card key={item.id} name={item.title} onClick={() => openTaskModal(item)} />)
        ) : (
          <p>No hay tareas</p>
        )}
      </Grid>
    </div>
  )
}

export default KanbanRow
