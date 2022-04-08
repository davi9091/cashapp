import React, { useState } from 'react'
import {
  AuthError,
  UserLoginData,
  UserRegisterData,
} from '../../../data/user/types'
import { Button } from '@mui/material'
import { FormDialog } from '../../FormDialog/FormDialog'
import { Login } from '../../Login/Login'
import { Register } from '../../Register/Register'

import styles from './LoginNav.module.css'

type Props = {
  onLogin: (data: UserLoginData) => Promise<AuthError | null>
  onRegister: (data: UserRegisterData) => Promise<AuthError | null>
}
export const LoginNav: React.FC<Props> = (props) => {
  const [isLoginOpen, setIsLoginOpen] = useState(false)
  const [isRegisterOpen, setIsRegisterOpen] = useState(false)

  return (
    <div className={styles.container}>
      <Button onClick={() => setIsLoginOpen(true)} type="button">
        Sign in
      </Button>
      <Button variant="outlined" onClick={() => setIsRegisterOpen(true)} type="button">
        Sign up
      </Button>

      <FormDialog open={isLoginOpen} onClose={() => setIsLoginOpen(false)}>
        <Login onClose={() => setIsLoginOpen(false)} onSubmit={props.onLogin} />
      </FormDialog>

      <FormDialog
        open={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
      >
        <Register
          onClose={() => setIsRegisterOpen(false)}
          onSubmit={props.onRegister}
        />
      </FormDialog>
    </div>
  )
}
