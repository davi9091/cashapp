import { getAllCurrencies } from './../user/utils/currencies'
import { getHeaders } from './../utils'
import { BehaviorSubject } from 'rxjs'
import { IDType } from '../user/types'
import { IUserService } from '../user/user.service'
import { AddFund, Fund, FundResponse } from './types'

const FETCH_ENDPOINTS = {
  getFunds: '/funds',
  newFund: '/funds/new',
}
export interface IFundsService {
  funds$: BehaviorSubject<Record<IDType, Fund>>
  selectedFund$: BehaviorSubject<Fund | null>

  addFunds(newFund: AddFund, saveAndSelect?: boolean): Promise<Fund>
  changeFundAmount(change: number, fundId: IDType): Fund
  updateCallback: () => void
}
export class FundsService {
  #userService: IUserService

  funds$ = new BehaviorSubject<Record<IDType, Fund>>({})
  selectedFund$ = new BehaviorSubject<Fund | null>(null)

  constructor(userService: IUserService) {
    this.#userService = userService

    userService.user$.subscribe((user) => {
      if (!user) {
        this.funds$.next({})
        this.selectedFund$.next(null)
        return
      }
      this.#fetchFunds().then(this.#nextFunds)
    })
  }

  #nextFunds = (allFunds: Record<string, Fund>) => {
    this.funds$.next(allFunds)
    const fundsArr = Object.values(allFunds)

    this.selectedFund$.next(fundsArr.length ? fundsArr[0] : null) 
  }

  updateCallback = () => {
    this.#fetchFunds().then()
  }

  changeFundAmount(change: number, fundId: IDType) {
    const fund = fundId
      ? this.funds$.getValue()[fundId]
      : this.selectedFund$.getValue()

    if (!fund) throw new Error(`Fund with id ${fundId} not found!`)

    return this.changeFund({ ...fund, amount: fund.amount + change })
  }

  changeFund(changedFund: Fund) {
    this.funds$.getValue()[changedFund.id] = changedFund
    if (this.selectedFund$.getValue()?.id === changedFund.id) {
      this.selectedFund$.next(changedFund)
    }

    return changedFund
  }

  async addFunds(newFund: AddFund, saveAndSelect = false) {
    const user = this.#userService.user$.getValue()
    if (!user) throw new Error('Tried to add fund when user is not logged in')

    const fund = await this.#addFund(newFund)

    this.#fetchFunds().then((allFunds) => {
      this.funds$.next(allFunds)
    
      saveAndSelect && this.selectedFund$.next(allFunds[fund.id])
    })

    return fund
  }

  async #addFund(newFund: AddFund) {
    try {
      const fundsResponse = await fetch(
        FETCH_ENDPOINTS.newFund,
        getHeaders({ ...newFund, currencyId: newFund.currency.id }, 'PUT'),
      )

      const fund: FundResponse = await fundsResponse.json()

      return fundResponseToModel(fund)
    } catch (err) {
      console.error(err)
      throw err
    }
  }

  async #fetchFunds() {
    try {
      const fundsResponse = await fetch(
        FETCH_ENDPOINTS.getFunds,
        getHeaders(undefined, 'GET'),
      )

      const funds: FundResponse[] = await fundsResponse.json()

      const readyFunds = funds.reduce<Record<string, Fund>>(
        (prev, curr) => ({ ...prev, [curr._id]: fundResponseToModel(curr) }),
        {},
      )

      return readyFunds
    } catch (err) {
      console.error(err)
      return {}
    }
  }
}

function fundResponseToModel(resp: FundResponse): Fund {
  const currencies = getAllCurrencies()

  const fundCurrency = currencies.find((cur) => resp.currencyId === cur.id)

  if (!fundCurrency) {
    throw new Error(`Couldn't find currency with id ${resp.currencyId}`)
  }

  return {
    ...resp,
    id: resp._id,
    owner: resp.owner.username,
    currency: fundCurrency,
  }
}
