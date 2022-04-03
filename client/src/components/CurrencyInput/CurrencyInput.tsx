import { InputAdornment, TextField, TextFieldProps } from '@mui/material'
import React from 'react'

const CurrencyAdornment = (props: {currencySign: string}) => {
  return <InputAdornment position="start">{props.currencySign}</InputAdornment>
}

type Props = {
  amount: string | number
  currencySign: string
  onChange?: React.ChangeEventHandler<HTMLInputElement>
  onClick?: React.MouseEventHandler<HTMLInputElement>

  textFieldProps?: TextFieldProps
}
export const CurrencyInput: React.FC<Props> = (props) => {
  return (
    <TextField
      InputProps={{
        startAdornment: <CurrencyAdornment currencySign={props.currencySign} />,
      }}
      onChange={props.onChange}
      onClick={props.onClick}
      value={props.amount}
      {...props.textFieldProps}
    />
  )
}


