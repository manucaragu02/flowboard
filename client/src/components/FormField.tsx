import { type ChangeEvent, type FC } from 'react'

interface FormFieldProps {
  id: string
  label: string
  type: string
  placeholder: string
  value: string
  onChange: (event: ChangeEvent<HTMLInputElement>) => void
  error?: string
}

const FormField: FC<FormFieldProps> = ({
  id,
  label,
  type,
  placeholder,
  value,
  onChange,
  error,
}) => {
  return (
    <div>
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
      {error && <span style={{ color: 'red' }}>{error}</span>}
    </div>
  )
}

export default FormField
