import { TextFieldProps } from '@mui/material'
import React from 'react'
import { AddFund, Fund } from '../../data/funds/types'
import { CurrencyInput } from '../CurrencyInput/CurrencyInput'

import styles from './AvailableFunds.module.css';

type Props<T = Fund | AddFund> = {
  funds: T
  className?: string
  textFieldProps?: TextFieldProps
  preventFocus?: boolean
  onClick?: (event: React.MouseEvent<HTMLInputElement>) => void
  onChange?: (updatedFund: T) => void
}

export const AvailableFundsComponent: React.FC<Props> = (props) => {
  return (
    <div className={styles.fund}>
      <CurrencyInput
        amount={props.funds.amount}
        currencySign={props.funds.currency.sign}
        onClick={props.onClick}
        textFieldProps={{
          ...props.textFieldProps,
          label: props.funds.name,
          className: props.className,
          ...(props.preventFocus
            ? { onMouseDown: (event) => event.preventDefault() }
            : null),
        }}
      />
    </div>
  )
}
