import type { ReactNode } from 'react'
import styles from './Grid.module.css'

interface Props {
  children: ReactNode
}

function Grid({ children }: Props) {
  return <div className={styles.grid}>{children}</div>
}

export default Grid
