import { Button, MenuItem, Select, TextField, Tooltip } from '@mui/material'
import React, { useState } from 'react'
import { getOperationGroups, OPERATION_GROUPS } from '../../data/funds/enums'
import { AddOperation, Fund } from '../../data/funds/types'
import {IGroupsService} from '../../data/Groups/groups.service'
import {OperationGroup} from '../../data/Groups/types'
import { CurrencyInput } from '../CurrencyInput/CurrencyInput'
import { GroupSelect } from '../GroupSelect/GroupSelect'

import styles from './AddOperation.module.css'

type AddOperationProps = {
  fund: Fund
  groupsService: IGroupsService
  onSubmit: (operation: AddOperation) => void
}
export const AddOperationComponent: React.FC<AddOperationProps> = ({
  groupsService,
  fund,
  onSubmit,
}) => {
  const [currentAmount, setCurrentAmount] = useState('')
  const [isDecreasing, setIsDecreasing] = useState(true)
  const [currentOperationGroup, setCurrentOperationGroup] =
    useState<OperationGroup | null>(null)
  const [currentOpLabel, setCurrentOpLabel] = useState<string>('')

  const handleSubmit = (event: React.SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault()

    const amountSaved = Number(currentAmount) * (isDecreasing ? -1 : 1)
    if (!amountSaved) return

    setCurrentAmount('')

    return currentOperationGroup && onSubmit({
      amount: amountSaved,
      groupName: currentOperationGroup.name,
      label:
        currentOpLabel || currentOperationGroup.emoji,
      creationDate: Date.now(),
      fundId: fund.id,
    })
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      {isDecreasing ? (
        <Button
          variant="outlined"
          type="button"
          onClick={() => setIsDecreasing(false)}
        >
          -
        </Button>
      ) : (
        <Button
          variant="outlined"
          type="button"
          onClick={() => setIsDecreasing(true)}
        >
          +
        </Button>
      )}

      <GroupSelect
        groupsService={groupsService}
        selectedGroup={currentOperationGroup}
        onChange={setCurrentOperationGroup}
      ></GroupSelect>

      <CurrencyInput
        currencySign={fund.currency.sign}
        onChange={(event) => setCurrentAmount(event.target.value)}
        amount={currentAmount}
        textFieldProps={{ label: 'Add Operation' }}
      />

      <TextField
        value={currentOpLabel}
        onChange={(event) => setCurrentOpLabel(event.target.value)}
        label="Operation label"
        placeholder={currentOperationGroup?.emoji}
      />

      <Button variant="outlined" type="submit">
        Add
      </Button>
    </form>
  )
}
