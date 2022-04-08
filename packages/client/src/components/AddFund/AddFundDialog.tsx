import {Dialog} from '@mui/material'
import React from 'react'
import { AddFund, Fund } from '../../data/funds/types'
import {Currency} from '../../data/user/types'
import {AddFundComponent} from './AddFund'

import styles from './AddFund.module.css'

type Props = {
  isOpen: boolean
  onClose: (newFund: AddFund | null, saveAndSelect?: boolean) => void
  defaultCurrency: Currency
}
export const AddFundDialog: React.FC<Props> = ({isOpen, onClose, defaultCurrency}) => {

  return (
    <Dialog 
      open={isOpen}
      onClose={() => onClose(null)}
    >
      <AddFundDialogContent defaultCurrency={defaultCurrency} onSubmit={onClose} />
    </Dialog>
  )
}

type ContentProps = {
  onSubmit: (newFund: AddFund | null, saveAndSelect?: boolean) => void
  defaultCurrency: Currency
}
const AddFundDialogContent: React.FC<ContentProps> = (props) => {

  return (
    <div className={styles.dialogContent}>
      <AddFundComponent
        onCreateFund={props.onSubmit}
        defaultCurrency={props.defaultCurrency}
      />
    </div>
  )
}
