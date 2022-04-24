import { Button, MenuItem, Select, TextField, Tooltip } from '@mui/material'
import React, { useState } from 'react'
import { getOperationGroups, OPERATION_GROUPS } from '../../data/funds/enums'
import { AddOperation, Fund } from '../../data/funds/types'
import {emojiMap} from '../../data/operations/emojiMapper'
import { CurrencyInput } from '../CurrencyInput/CurrencyInput'

import styles from './AddOperation.module.css'

type AddOperationProps = {
  fund: Fund
  onSubmit: (operation: AddOperation) => void
}
export const AddOperationComponent: React.FC<AddOperationProps> = ({
  fund,
  onSubmit,
}) => {
  const [currentAmount, setCurrentAmount] = useState('')
  const [isDecreasing, setIsDecreasing] = useState(true)
  const [currentOperationGroup, setCurrentOperationGroup] =
    useState<OPERATION_GROUPS>(OPERATION_GROUPS.NONE)
  const [currentOpLabel, setCurrentOpLabel] = useState<string>('')

  const operationGroups = getOperationGroups()

  const handleSubmit = (event: React.SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault()

    const amountSaved = Number(currentAmount) * (isDecreasing ? -1 : 1)
    if (!amountSaved) return

    setCurrentAmount('')

    return onSubmit({
      amount: amountSaved,
      groupName: currentOperationGroup,
      label:
        currentOpLabel || operationGroups[currentOperationGroup].defaultLabel,
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

      <Select
        value={operationGroups[currentOperationGroup]}
        renderValue={(group) => emojiMap[group.type]}
        onChange={(event) =>
          setCurrentOperationGroup(event.target.value as OPERATION_GROUPS)
        }
      >
        {Object.values(OPERATION_GROUPS).map((t) => (
          <MenuItem key={t} value={t}>
            <Tooltip arrow title={operationGroups[t].name} >
              <div>{emojiMap[operationGroups[t].type]}</div>
          </Tooltip>
          </MenuItem>
        ))}
      </Select>

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
        placeholder={operationGroups[currentOperationGroup].defaultLabel}
      />

      <Button variant="outlined" type="submit">
        Add
      </Button>
    </form>
  )
}
