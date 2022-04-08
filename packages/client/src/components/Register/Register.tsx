import { TextField } from '@mui/material'
import { LoadingButton } from '@mui/lab'
import React, { useState } from 'react'
import { AuthError, Currency, UserRegisterData } from '../../data/user/types'
import { onInputChange } from '../utils'
import { useLoading, useMemoizedCurrencies } from '../hooks'
import { getDefaultCurrency } from '../../data/user/utils/currencies'
import { CurrencySelect } from '../CurrencySelect/CurrencySelect'

import commonStyles from '../common.module.css'

type Props = {
  onSubmit: (data: UserRegisterData) => Promise<AuthError | null>
  onClose: () => void
}
export const Register: React.FC<Props> = ({ onSubmit, onClose }) => {
  const [login, setLogin] = useState('')
  const [password, setPassword] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [currency, setCurrency] = useState<Currency>(getDefaultCurrency())

  const currencies = useMemoizedCurrencies()

  const { loading, trigger } = useLoading(onClose)
  const handleSubmit = (event: React.SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault()
    trigger(
      onSubmit({
        username: login,
        password,
        firstName,
        lastName,
        defaultCurrencyId: currency.id,
      }),
    )
  }

  return (
    <form className={commonStyles.form} onSubmit={handleSubmit}>
      <TextField
        type="username"
        id="login"
        label="Login"
        onChange={onInputChange(setLogin)}
        inputProps={{
          autoComplete: 'username',
        }}
      />
      <TextField
        type="password"
        id="password"
        label="Password"
        onChange={onInputChange(setPassword)}
        inputProps={{
          autoComplete: 'new-password',
        }}
      />
      <TextField
        type="firstName"
        id="firstName"
        label="First Name"
        onChange={onInputChange(setFirstName)}
      />
      <TextField
        type="lastName"
        id="lastName"
        label="Last Name"
        onChange={onInputChange(setLastName)}
      />
      <CurrencySelect
        onChange={setCurrency}
        value={currency}
        currencies={currencies}
      />

      <LoadingButton loading={loading} type="submit">
        Sign up
      </LoadingButton>
    </form>
  )
}
