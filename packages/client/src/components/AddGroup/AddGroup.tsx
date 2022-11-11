import { TextField } from '@mui/material'
import React, { useState } from 'react'
import { onInputChange } from '../utils'
import { TwoWaySwitch } from './TwoWaySwitch'

const INCOME_LABEL = 'Income'
const EXPENSE_LABEL = 'Expense'

type Props = {}
export const AddGroup: React.FC<Props> = () => {
  const [name, setName] = useState('')
  const [emoji, setEmoji] = useState('')
  const [isIncome, setIsIncome] = useState(false)

  return (
    <form>
      <TextField value={name} onChange={onInputChange(setName)} />
      <TextField value={emoji} onChange={onInputChange(setEmoji)} />
      <TwoWaySwitch
        value={isIncome}
        onChange={setIsIncome}
        trueLabel={INCOME_LABEL}
        falseLabel={EXPENSE_LABEL}
      />
    </form>
  )
}
