import type { BaseSyntheticEvent, ReactNode } from 'react'

interface Props {
  onSubmit: (e: BaseSyntheticEvent) => void
  submitLabel: string
  children: ReactNode
  loading: boolean
}

function Form({ onSubmit, submitLabel, children, loading }: Props) {
  return (
    <form onSubmit={onSubmit}>
      {children}
      <button type="submit" disabled={loading}>
        {submitLabel}
      </button>
    </form>
  )
}

export default Form
