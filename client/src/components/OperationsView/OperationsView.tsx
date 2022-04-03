import { CircularProgress } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { BehaviorSubject } from 'rxjs'
import { AddOperation, Fund, Operation } from '../../data/funds/types'
import { OperationsService } from '../../data/operations/operations.service'
import { AddOperationComponent } from '../AddOperation/AddOperation'
import { OperationComponent } from '../Operation/Operation'

type Props = {
  operationsService: OperationsService
  activeFund$: BehaviorSubject<Fund | null>
}

export const OperationsView: React.FC<Props> = ({
  operationsService,
  activeFund$,
}) => {
  const [operations, setOperations] = useState<Operation[]>([])
  const [activeFund, setActiveFund] = useState<Fund | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const opsSub = operationsService.operations$.subscribe(setOperations)
    const fundSub = activeFund$.subscribe(setActiveFund)
    const opsLoadingSub = operationsService.opsLoading$.subscribe(setLoading)

    return () => {
      opsSub.unsubscribe()
      fundSub.unsubscribe()
      opsLoadingSub.unsubscribe()
    }
  }, [setActiveFund, setOperations, operationsService, activeFund$])

  const handleOperationSubmit = (operation: AddOperation) =>
    operationsService.addOperation(operation)

  return activeFund ? (
    <div>
      <AddOperationComponent
        fund={activeFund}
        onSubmit={handleOperationSubmit}
      />

      {loading && <CircularProgress />}

      {!loading &&
        operations &&
        operations.map((operation) => (
          <OperationComponent
            currency={activeFund.currency}
            operation={operation}
            key={operation.id}
          />
        ))}
    </div>
  ) : null
}
