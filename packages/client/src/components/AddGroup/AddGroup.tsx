import { TextField } from '@mui/material'
import React from 'react'
import { CustomOpGroup } from '../../data/Groups/types'
import { onInputChange } from '../utils'
import { TwoWaySwitch } from './TwoWaySwitch'

const INCOME_LABEL = 'Income'
const EXPENSE_LABEL = 'Expense'

type Props = {
  group: CustomOpGroup
  onChange: (group: CustomOpGroup) => void
}
export const AddGroup: React.FC<Props> = ({ group, onChange }) => {
  const onChangeName = (name: string) => {
    onChange({ ...group, name })
  }
  const onChangeEmoji = (emoji: string) => {
    onChange({ ...group, emoji })
  }
  const onChangeIsIncome = (isIncome: boolean) => {
    onChange({ ...group, isIncome })
  }

  return (
    <form>
      <TextField value={group.name} onChange={onInputChange(onChangeName)} />
      <TextField value={group.emoji} onChange={onInputChange(onChangeEmoji)} />
      <TwoWaySwitch
        value={group.isIncome}
        onChange={onChangeIsIncome}
        trueLabel={INCOME_LABEL}
        falseLabel={EXPENSE_LABEL}
      />
    </form>
  )
}
