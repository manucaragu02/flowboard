import type { ReactNode } from 'react'
import styles from './Card.module.css'

interface Props {
  name: string
  children?: ReactNode
}

function Card({ name, children }: Props) {
  return (
    <div className={styles.container}>
      <h2>{name}</h2>
      {children}
    </div>
  )
}

export default Card
