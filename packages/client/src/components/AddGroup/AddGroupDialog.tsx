import {useState} from 'react'
import { CustomOpGroup, OperationGroup } from '../../data/Groups/types'
import { FormDialog } from '../FormDialog/FormDialog'
import { AddGroup } from './AddGroup'

type Props = {
  isOpen: boolean
  onClose: (group: CustomOpGroup) => void
}

const DEFAULT_GROUP: CustomOpGroup = {
  name: '',
  emoji: '',
  isDefault: false,
  isIncome: false,
}

export const AddGroupDialog: React.VFC<Props> = ({ isOpen, onClose }) => {
  const [newGroup, setNewGroup] = useState<CustomOpGroup>(DEFAULT_GROUP)

  return (
    <FormDialog open={isOpen} onClose={() => onClose(newGroup)}>
      <AddGroup group={newGroup} onChange={setNewGroup}></AddGroup>
    </FormDialog>
  )
}
