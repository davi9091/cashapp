import {Dialog} from '@mui/material'
import React from 'react'
import { AddFund, Fund } from '../../data/funds/types'
import {AddFundComponent} from './AddFund'

import styles from './AddFund.module.css'

type Props = {
  isOpen: boolean
  onClose: (newFund: AddFund | null, saveAndSelect?: boolean) => void
  fund: Fund | null,
}
export const AddFundDialog: React.FC<Props> = ({isOpen, onClose, fund}) => {
  return (
    <Dialog 
      keepMounted={false}
      open={isOpen}
      onClose={() => onClose(null)}
    >
      <AddFundDialogContent onSubmit={onClose} fund={fund} />
    </Dialog>
  )
}

type ContentProps = {
  onSubmit: (newFund: AddFund | null, saveAndSelect?: boolean) => void
  fund: Fund | null
}
const AddFundDialogContent: React.FC<ContentProps> = (props) => {

  return (
    <div className={styles.dialogContent}>
      <AddFundComponent
        onSave={props.onSubmit}
        fund={props.fund}
      />
    </div>
  )
}
