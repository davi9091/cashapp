import React, { useEffect, useState } from 'react'
import { User } from './data/user/types'
import { IFundsService } from './data/funds/funds.service'
import { FundsView } from './components/FundsView/FundsView'
import { IUserService, RESTORING_USER } from './data/user/user.service'
import { OperationsService } from './data/operations/operations.service'
import { OperationsView } from './components/OperationsView/OperationsView'

import appStyle from './App.module.css'
import { NavBar } from './components/NavBar/NavBar'
import { Landing } from './components/Landing/Landing'
import { CircularProgress } from '@mui/material'

type Props = {
  userService: IUserService
  fundsService: IFundsService
  operationsService: OperationsService
}
export const App: React.FC<Props> = ({
  userService,
  fundsService,
  operationsService,
}) => {
  const [currentUser, setCurrentUser] = useState<
    User | null | typeof RESTORING_USER
  >(userService.user$.getValue())

  useEffect(() => {
    const subscription = userService.user$.subscribe((user) =>
      setCurrentUser(user),
    )

    return () => subscription.unsubscribe()
  })

  return (
    <div>
      {currentUser === RESTORING_USER ? (
        <div className={appStyle.loadingPage}>
          <CircularProgress />
        </div>
      ) : (
        <div className={appStyle.App}>
          <NavBar user={currentUser} userService={userService} />

          {!currentUser && <Landing />}

          {currentUser && (
            <div className={appStyle.AppContainer}>
              <OperationsView
                operationsService={operationsService}
                activeFund$={fundsService.selectedFund$}
              />

              <FundsView
                fundsService={fundsService}
              />
            </div>
          )}
        </div>
      )}{' '}
    </div>
  )
}

export default App
