import {Dialog} from '@mui/material'
import React from 'react'
import { AddFund } from '../../data/funds/types'
import {AddFundComponent} from './AddFund'

import styles from './AddFund.module.css'

type Props = {
  isOpen: boolean
  onClose: (newFund: AddFund | null, saveAndSelect?: boolean) => void
}
export const AddFundDialog: React.FC<Props> = ({isOpen, onClose}) => {
  return (
    <Dialog 
      open={isOpen}
      onClose={() => onClose(null)}
    >
      <AddFundDialogContent onSubmit={onClose} />
    </Dialog>
  )
}

type ContentProps = {
  onSubmit: (newFund: AddFund | null, saveAndSelect?: boolean) => void
}
const AddFundDialogContent: React.FC<ContentProps> = (props) => {

  return (
    <div className={styles.dialogContent}>
      <AddFundComponent
        onCreateFund={props.onSubmit}
      />
    </div>
  )
}
