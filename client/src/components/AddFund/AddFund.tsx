import { Button, TextField } from '@mui/material'
import React, { useState } from 'react'
import { AddFund } from '../../data/funds/types'
import { Currency } from '../../data/user/types'
import { CurrencyInputWithSelect } from '../CurrencyInput/CurrencyInputWithSelect'
import { useMemoizedCurrencies } from '../hooks'

import styles from './AddFund.module.css'

const MAX_NAME_LENGTH = 30

type Props = {
  onCreateFund: (fund: AddFund | null, saveAndClose: boolean) => void
  defaultCurrency: Currency
}
export const AddFundComponent: React.FC<Props> = (props) => {
  const [strAmount, setStrAmount] = useState('')
  const [currency, setCurrency] = useState(props.defaultCurrency)
  const [name, setName] = useState('')

  const currencies = useMemoizedCurrencies()

  const handleNameChange: React.ChangeEventHandler<HTMLInputElement> = (
    event,
  ) => {
    const name = event.target.value
    if (name.length > MAX_NAME_LENGTH) return
    setName(name)
  }

  const handleCreateFund = (saveAndClose: boolean) => {
    const amount = Number(strAmount)

    if (!amount) return

    const fund: AddFund = {
      amount,
      currency,
      name,
    }

    return props.onCreateFund(fund, saveAndClose)
  }

  return (
    <div className={styles.container}>
      <div style={{width: '100%'}}>
        <TextField
          label="New fund name"
          value={name}
          onChange={handleNameChange}
          fullWidth
        />
      </div>

      <div style={{width: '100%'}}>
        <CurrencyInputWithSelect
          selectedCurrency={currency}
          amount={strAmount}
          onCurrencyChange={setCurrency}
          onAmountChange={setStrAmount}
          currencies={currencies}
          textFieldProps={{ label: 'Amount', fullWidth: true }}
        />
      </div>

      <div className={styles.buttons}>
        <Button
          variant="outlined"
          type="button"
          onClick={() => handleCreateFund(false)}
        >
          Add
        </Button>

        <Button
          variant="outlined"
          type="button"
          onClick={() => handleCreateFund(true)}
        >
          Add and select
        </Button>

        <Button 
          variant="outlined"
          type="button"
          color="error"
          onClick={() => props.onCreateFund(null, false)}
        >
          Cancel
        </Button>
      </div>
    </div>
  )
}
