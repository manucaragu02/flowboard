import type { BaseSyntheticEvent, ReactNode } from 'react'

interface Props {
  onSubmit: (e: BaseSyntheticEvent) => void
  submitLabel: string
  children: ReactNode
}

function Form({ onSubmit, submitLabel, children }: Props) {
  return (
    <form onSubmit={onSubmit}>
      {children}
      <button type="submit">{submitLabel}</button>
    </form>
  )
}

export default Form
