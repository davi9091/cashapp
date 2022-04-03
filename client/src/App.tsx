import React, { useEffect, useState } from 'react'
import { User } from './data/user/types'
import { IFundsService } from './data/funds/funds.service'
import { FundsView } from './components/FundsView/FundsView'
import { UserView } from './components/UserView/UserView'
import { IUserService } from './data/user/user.service'
import { OperationsService } from './data/operations/operations.service'
import { OperationsView } from './components/OperationsView/OperationsView'

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
  const [currentUser, setCurrentUser] = useState<User | null>(
    userService.user$.getValue(),
  )

  useEffect(() => {
    const subscription = userService.user$.subscribe((user) =>
      setCurrentUser(user),
    )

    return () => subscription.unsubscribe()
  })

  return (
    <div className="App">
      <UserView user={currentUser} userService={userService} />

      {currentUser && (
        <div>
          <FundsView
            fundsService={fundsService}
            defaultCurrency={currentUser.defaultCurrency}
          />

          <OperationsView
            operationsService={operationsService}
            activeFund$={fundsService.selectedFund$}
          />
        </div>
      )}
    </div>
  )
}

export default App
