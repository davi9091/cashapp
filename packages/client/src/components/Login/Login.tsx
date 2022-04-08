import { TextField } from '@mui/material'
import { LoadingButton } from '@mui/lab'
import React, { useState } from 'react'
import { AuthError, UserLoginData } from '../../data/user/types'
import { onInputChange } from '../utils'
import { useLoading } from '../hooks'

type Props = {
  onSubmit: (data: UserLoginData) => Promise<AuthError | null>
  onClose: () => void
}
export const Login: React.FC<Props> = ({ onSubmit, onClose }) => {
  const [login, setLogin] = useState('')
  const [password, setPassword] = useState('')

  const { loading, error, trigger } = useLoading(onClose, [login, password])

  const handleSubmit = (event: React.SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault()
    trigger(onSubmit({ username: login, password }))
  }

  return (
    <form onSubmit={handleSubmit}>
      {error && <div>{error}</div>}
      <TextField
        type="text"
        id="login"
        label="Login"
        error={!!error}
        onChange={onInputChange(setLogin)}
        inputProps={{
          autoComplete: 'username',
        }}
      />
      <TextField
        type="password"
        id="password"
        label="Password"
        error={!!error}
        onChange={onInputChange(setPassword)}
        inputProps={{
          autoComplete: 'password',
        }}
      />

      <LoadingButton loading={loading} type="submit">
        Sign in
      </LoadingButton>
    </form>
  )
}
