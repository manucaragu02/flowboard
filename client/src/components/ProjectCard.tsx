import styles from './WorkspaceCard.module.css'

interface Props {
  name: string
  taskCount: number
}

function ProjectCard({ name, taskCount }: Props) {
  return (
    <div className={styles.container}>
      <h2>{name}</h2>
      <p>
        {taskCount} tarea{taskCount !== 1 ? 's' : ''}
      </p>
    </div>
  )
}

export default ProjectCard
