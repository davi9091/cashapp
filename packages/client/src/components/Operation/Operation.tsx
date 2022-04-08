import { Button } from '@mui/material'
import React from 'react'
import { Operation } from '../../data/funds/types'
import { Currency } from '../../data/user/types'

import styles from './Operation.module.css'

type OperationProps = {
  currency: Currency
  operation: Operation
}
export const OperationComponent: React.FC<OperationProps> = ({
  operation,
  currency,
}) => {
  const isNegative = operation.amount < 0
  const viewAmount = Math.abs(operation.amount)

  return (
    <div className={styles.operation}>
      <div className={styles.details}>
        {isNegative ? ' - ' : ''}
        {currency.sign}
        {viewAmount} {operation.label}
      </div>

      <Button variant="outlined">Info</Button>
    </div>
  )
}
