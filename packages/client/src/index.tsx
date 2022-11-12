import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import reportWebVitals from './reportWebVitals'
import { UserService } from './data/user/user.service'
import { FundsService } from './data/funds/funds.service'
import { userMock } from './data/user/mocks/mocks'
import { OperationsService } from './data/operations/operations.service'
import { GroupsService } from './data/Groups/groups.service'

const startApp = async () => {
  const userService = new UserService()
  const fundsService = new FundsService(userService)
  const operationsService = new OperationsService(
    fundsService.selectedFund$,
    fundsService.updateCallback,
  )
  const groupsService = new GroupsService(userService)

  ReactDOM.render(
    <React.StrictMode>
      <App
        userService={userService}
        fundsService={fundsService}
        operationsService={operationsService}
        groupsService={groupsService}
      />
    </React.StrictMode>,
    document.getElementById('root'),
  )
}

startApp()

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
