import type { ReactNode } from 'react'
import styles from './Card.module.css'

interface Props {
  name: string
  children?: ReactNode
  onClick?: () => void
}

function Card({ name, children, onClick }: Props) {
  return (
    <button className={styles.container} onClick={onClick}>
      <h2>{name}</h2>
      {children}
    </button>
  )
}

export default Card
