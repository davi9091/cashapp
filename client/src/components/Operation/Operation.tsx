import React from 'react'
import {Operation} from '../../data/funds/types'
import { Currency } from '../../data/user/types'

type OperationProps = {
  currency: Currency
  operation: Operation
}
export const OperationComponent: React.FC<OperationProps> = ({operation, currency}) => {
  return (
    <div>
      {currency.sign}
      {operation.amount} ({currency.shortName})
      {operation.label}
    </div>
  )
}
