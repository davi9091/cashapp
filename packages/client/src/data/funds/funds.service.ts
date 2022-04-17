import { getAllCurrencies } from './../user/utils/currencies'
import { getHeaders } from './../utils'
import { BehaviorSubject } from 'rxjs'
import { IDType } from '../user/types'
import { IUserService } from '../user/user.service'
import { AddFund, Fund, FundResponse } from './types'

const FETCH_ENDPOINTS = {
  getFunds: '/funds',
  newFund: '/funds/new',
  removeFund: '/funds',
  editFund: '/funds/edit',
}

export interface IFundsService {
  funds$: BehaviorSubject<Record<IDType, Fund>>
  selectedFund$: BehaviorSubject<Fund | null>

  addFunds(newFund: AddFund, saveAndSelect?: boolean): Promise<Fund>
  editFund(fund: AddFund, saveAndSelect?: boolean): Promise<Fund>
  removeFund(fundId: IDType): Promise<void>
  updateCallback: (dropSelected?: boolean) => void
}
export class FundsService implements IFundsService {
  #userService: IUserService

  funds$ = new BehaviorSubject<Record<IDType, Fund>>({})
  selectedFund$ = new BehaviorSubject<Fund | null>(null)
  updateCallback = (dropSelected?: boolean) =>
    this.#fetchFunds().then((funds) => this.#nextFunds(funds, dropSelected))

  constructor(userService: IUserService) {
    this.#userService = userService

    userService.user$.subscribe((user) => {
      if (!user) {
        this.funds$.next({})
        this.selectedFund$.next(null)
        return
      }
      this.updateCallback(true)
    })
  }

  #nextFunds = (
    allFunds: Record<string, Fund>,
    dropSelected = false,
    fundToSelect?: Fund,
  ) => {
    this.funds$.next(allFunds)
    const fundsArr = Object.values(allFunds)

    const currentSelected = fundsArr.find(
      (fund) => fund.id === this.selectedFund$.getValue()?.id,
    )

    const newSelected =
      fundToSelect || fundsArr.length
        ? !dropSelected && currentSelected
          ? currentSelected
          : fundsArr[0]
        : null

    this.selectedFund$.next(newSelected)
  }

  async addFunds(newFund: AddFund, saveAndSelect = false) {
    const user = this.#userService.user$.getValue()
    if (!user) throw new Error('Tried to add fund when user is not logged in')

    const fund = await this.#addFund(newFund)

    this.#fetchFunds().then((allFunds) => {
      this.funds$.next(allFunds)

      if (saveAndSelect || Object.keys(allFunds).length === 1)
        this.selectedFund$.next(fund)
    })

    return fund
  }

  async editFund(fund: Fund, saveAndSelect = false) {
    const editedFund = await this.#editFund(fund)

    const updatedFunds = await this.#fetchFunds()
    this.#nextFunds(updatedFunds, false, saveAndSelect ? editedFund : undefined)

    return editedFund
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

  async removeFund(id: IDType) {
    try {
      const removeResponse = await fetch(
        FETCH_ENDPOINTS.removeFund + `/${id}`,
        getHeaders(undefined, 'DELETE'),
      )

      if (removeResponse.status > 399) {
        throw new Error(removeResponse.statusText)
      }

      return this.updateCallback()
    } catch (error) {
      console.error('[FundsService]: Error while deleting funds', error)
      throw error
    }
  }

  async #editFund(fund: Fund) {
    try {
      const editResponse = await fetch(
        FETCH_ENDPOINTS.editFund + `/${fund.id}`,
        getHeaders({ ...fund, currencyId: fund.currency.id, }, 'POST'),
      )

      const resp: FundResponse = await editResponse.json()
      console.log(fundResponseToModel(resp))
      return fundResponseToModel(resp)
    } catch (error) {
      console.error('[FundsService]: Error while editing fund', error)
      throw error
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
