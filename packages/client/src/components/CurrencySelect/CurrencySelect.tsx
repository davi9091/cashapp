import { MenuItem, Select, SelectChangeEvent } from '@mui/material'
import React from 'react'
import { Currency } from '../../data/user/types'

type Props = {
  value: Currency
  currencies: Currency[]
  onChange: (currency: Currency) => void
}
export const CurrencySelect: React.FC<Props> = (props) => {
  const handleCurrencyChange = (event: SelectChangeEvent) => {
    const newCurrency =
      props.currencies.find((currency) => currency.id === event.target.value) ||
      props.currencies[0]
    return props.onChange(newCurrency)
  }

  return (
    <div>
      <Select value={props.value.id} onChange={handleCurrencyChange}>
        {props.currencies.map((currency) => (
          <MenuItem key={currency.id} value={currency.id}>
            {currency.name}
          </MenuItem>
        ))}
      </Select>
    </div>
  )
}
