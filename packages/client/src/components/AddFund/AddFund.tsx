import { Button, TextField } from '@mui/material'
import React, { useState } from 'react'
import { AddFund, Fund } from '../../data/funds/types'
import {getDefaultCurrency} from '../../data/user/utils/currencies'
import { CurrencyInputWithSelect } from '../CurrencyInput/CurrencyInputWithSelect'
import { useMemoizedCurrencies } from '../hooks'

import styles from './AddFund.module.css'

const MAX_NAME_LENGTH = 30

type Props = {
  onSave: (fund: AddFund | Fund | null, saveAndSelect: boolean) => void
  fund: Fund | null
}
export const AddFundComponent: React.FC<Props> = ({onSave, fund}) => {
  const [strAmount, setStrAmount] = useState(String(fund?.amount || ''))
  const [currency, setCurrency] = useState(fund?.currency || getDefaultCurrency())
  const [name, setName] = useState(fund?.name || '')

  const currencies = useMemoizedCurrencies()

  const handleNameChange: React.ChangeEventHandler<HTMLInputElement> = (
    event,
  ) => {
    const name = event.target.value
    if (name.length > MAX_NAME_LENGTH) return
    setName(name)
  }

  const handleCreateFund = (saveAndSelect: boolean) => {
    const amount = Number(strAmount)

    if (!amount) return

    const toSave = {
      ...fund,
      amount,
      currency,
      name,
    }

    return onSave(toSave, saveAndSelect)
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
          Save
        </Button>

        <Button
          variant="outlined"
          type="button"
          onClick={() => handleCreateFund(true)}
        >
          Save and select
        </Button>

        <Button 
          variant="outlined"
          type="button"
          color="error"
          onClick={() => onSave(null, false)}
        >
          Cancel
        </Button>
      </div>
    </div>
  )
}
