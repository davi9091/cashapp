import { IDType } from './../user/types'
import { AddOperation } from './../funds/types'
import { BehaviorSubject } from 'rxjs'
import { getOperationGroups } from '../funds/enums'
import { Fund, Operation, OpsResponse } from '../funds/types'
import { getAllCurrencies } from '../user/utils/currencies'
import { getHeaders } from '../utils'

const OPS_ENDPOINTS = {
  getOperations: 'operations',
  newOperations: 'operations',
}

export class OperationsService {
  operations$ = new BehaviorSubject<Operation[]>([])
  opsLoading$ = new BehaviorSubject<boolean>(false)
  readonly #updateCallback: () => void

  constructor(
    selectedFund$: BehaviorSubject<Fund | null>,
    updateCallback: () => void,
  ) {
    selectedFund$.subscribe(async (fund) => {
      fund
        ? this.operations$.next(await this.fetchOperations(fund.id))
        : this.operations$.next([])
    })

    this.#updateCallback = updateCallback
  }

  async fetchOperations(fundId: IDType): Promise<Operation[]> {
    this.opsLoading$.next(true)
    const ops = await fetchOperations(fundId)
    this.opsLoading$.next(false)
    return ops
  }

  async addOperation(operation: AddOperation) {
    await addOperation(operation)
    this.#updateCallback()
  }
}

function opsResponseToModel(resp: OpsResponse): Operation {
  const groups = getOperationGroups()
  const currencies = getAllCurrencies()
  const fundCurrency = currencies.find((cur) => resp.fund.currencyId === cur.id)

  if (!fundCurrency) {
    throw new Error(`Couldn't find currency with id ${resp.fund.currencyId}`)
  }

  return {
    ...resp,
    group: groups[resp.groupName],
    fundId: resp.fund._id,
    id: resp._id,
  }
}

async function addOperation(operation: AddOperation) {
  try {
    const opsResponse = await fetch(
      window.location.href + OPS_ENDPOINTS.newOperations,
      getHeaders(operation, 'PUT'),
    )

    const newOperation: OpsResponse = await opsResponse.json()

    return opsResponseToModel(newOperation)
  } catch (err) {
    console.error(err)
    return []
  }
}

async function fetchOperations(fundId: string) {
  try {
    const opsResponse = await fetch(
      `${window.location.href}${OPS_ENDPOINTS.getOperations}/${fundId}`,
      getHeaders(undefined, 'GET'),
    )

    const ops: OpsResponse[] = await opsResponse.json()

    return ops.map(opsResponseToModel)
  } catch (err) {
    console.error(err)
    return []
  }
}
