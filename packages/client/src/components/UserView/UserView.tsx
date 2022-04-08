import { Avatar, Button } from '@mui/material'
import React from 'react'
import { User } from '../../data/user/types'
import { IUserService } from '../../data/user/user.service'
import { LoginNav } from './LoginNav/LoginNav'

import styles from './UserView.module.css'

function stringToColor(str: string) {
  let hash = 0
  let i

  /* eslint-disable no-bitwise */
  for (i = 0; i < str.length; i += 1) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash)
  }

  let color = '#'

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff
    color += `00${value.toString(16)}`.substr(-2)
  }
  /* eslint-enable no-bitwise */

  return color
}

function stringAvatar(firstName: string, lastName: string) {
  return {
    sx: {
      bgcolor: stringToColor(firstName + lastName),
      fontSize: '16px',
      width: '32px',
      height: '32px',
    },
    children: `${firstName[0]}${lastName[0]}`,
  }
}

type Props = {
  userService: IUserService
  user: User | null
}
export const UserView: React.FC<Props> = ({ userService, user }) => {
  return (
    <div>
      {!user && (
        <LoginNav
          onLogin={(data) => userService.login(data)}
          onRegister={(data) => userService.register(data)}
        />
      )}

      {user && (
        <div className={styles.userContainer}>
          <div>
            <Avatar
              alt={user.firstName}
              {...stringAvatar(user.firstName, user.lastName)}
            />
          </div>
          <div>
            {user.firstName} {user.lastName}
          </div>

          <Button onClick={() => userService.logout()} type="button">
            Log out
          </Button>
        </div>
      )}
    </div>
  )
}
