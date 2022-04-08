import React from 'react'
import {
  TextFieldProps,
} from '@mui/material'
import { Currency } from '../../data/user/types'
import { CurrencyInput } from './CurrencyInput'

import styles from './CurrencyInput.module.css'
import { CurrencySelect } from '../CurrencySelect/CurrencySelect'

type Props = {
  selectedCurrency: Currency
  currencies: Currency[]

  textFieldProps?: TextFieldProps
  amount: string

  onAmountChange: (amount: string) => void
  onCurrencyChange: (currency: Currency) => void
}
export const CurrencyInputWithSelect: React.FC<Props> = (props) => {
  return (
    <div className={styles.withSelectContainer}>
      <div className={styles.marginRight}>
        <CurrencyInput
          {...props}
          currencySign={props.selectedCurrency.sign}
          onChange={(event) => props.onAmountChange(event.target.value)}
        />
      </div>

      <div>
        <CurrencySelect
          value={props.selectedCurrency}
          onChange={props.onCurrencyChange}
          currencies={props.currencies}
        />
      </div>
    </div>
  )
}
