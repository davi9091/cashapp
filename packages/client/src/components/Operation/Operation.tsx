import { Button, Tooltip } from '@mui/material'
import { format, formatDistance } from 'date-fns'
import React from 'react'
import { Operation } from '../../data/funds/types'
import { emojiMap } from '../../data/operations/emojiMapper'
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

  const displayedTime = formatDistance(
    new Date(operation.creationDate),
    new Date(),
    { addSuffix: true },
  )
  const exactTime = format(
    new Date(operation.creationDate),
    'MMMM dd yyyy, hh:mm:ss',
  )

  return (
    <div className={styles.operation}>
      <div className={styles.details}>
        <div className={styles.emoji}>{emojiMap[operation.group.type]}</div>

        <div className={styles.timestamp}>
          <Tooltip arrow title={exactTime}>
            <div className={styles.timestamp}>{displayedTime}</div>
          </Tooltip>
        </div>
        <div className={styles.label}>{operation.label}</div>
        <div className={styles.amount}>
          {isNegative ? ' - ' : ''}
          {currency.sign}
          {viewAmount}
        </div>
      </div>

      <div className={styles.rightSide}>
        <Button variant="outlined">Info</Button>
      </div>
    </div>
  )
}
