import styles from './WorkspaceCard.module.css'

interface Props {
  name: string
  memberCount: number
  projectCount: number
}

function WorkspaceCard({ name, memberCount, projectCount }: Props) {
  return (
    <div className={styles.container}>
      <h2>{name}</h2>
      <p>
        {memberCount} miembro{memberCount !== 1 ? 's' : ''}
      </p>
      <p>
        {projectCount} proyecto{projectCount !== 1 ? 's' : ''}
      </p>
    </div>
  )
}

export default WorkspaceCard
