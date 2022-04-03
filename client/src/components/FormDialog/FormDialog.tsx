import { Dialog } from '@mui/material'
import React, { ReactNode } from 'react'

type DialogProps = {
  children: ReactNode
  open: boolean
  onClose: () => void
}

export const FormDialog: React.FC<DialogProps> = ({ open, children, onClose }) => {
  return (
    <Dialog onClose={onClose} keepMounted={false} open={open} >
      {children}
    </Dialog>
  )
}
