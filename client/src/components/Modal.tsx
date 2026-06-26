import { forwardRef, type ReactNode } from 'react'

interface Props {
  toggleDialog: () => void
  children: ReactNode
}

const Modal = forwardRef<HTMLDialogElement, Props>(({ toggleDialog, children }, ref) => {
  return (
    <dialog
      ref={ref}
      onClick={(e) => {
        if (e.currentTarget === e.target) {
          toggleDialog()
        }
      }}
    >
      {children}
    </dialog>
  )
})

export default Modal
