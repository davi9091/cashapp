import { Button, Menu, MenuItem, Select } from '@mui/material'
import { getOperationGroups, OPERATION_GROUPS } from '../../data/funds/enums'
import { emojiMap } from '../../data/operations/emojiMapper'
import { AddGroupDialog } from '../AddGroup/AddGroupDialog'

import styles from './GroupSelect.module.css'

type Props = {
  selectedGroup: OPERATION_GROUPS
  onChange: (group: OPERATION_GROUPS) => void
}

export const GroupSelect = ({ selectedGroup, onChange }: Props) => {
  const operationGroups = getOperationGroups()
  const [dialogOpen, setDialogOpen] = useState(false);
  const onAddGroup = () => {}

  return (
    <>
      <Select
        value={operationGroups[selectedGroup]}
        renderValue={(group) => emojiMap[group.type]}
        onChange={(event) => onChange(event.target.value as OPERATION_GROUPS)}
      >
        {Object.values(OPERATION_GROUPS).map((t) => (
          <MenuItem key={t} value={t}>
            <div className={styles.emoji}>
              {emojiMap[operationGroups[t].type]}
            </div>
            <div>{operationGroups[t].name}</div>
          </MenuItem>
        ))}

        {/**
         * add custom group creation button
         */}
        <MenuItem
          key="add-group"
          value={OPERATION_GROUPS.ADD_NEW}
          onClick={onAddGroup}
        >
          <Button type="button" variant="outlined">
            Add new group
          </Button>
        </MenuItem>
      </Select>
    
      <AddGroupDialog isOpen={dialogOpen} onClose={(group) => onChange(group.type)}></AddGroupDialog>
    </>
  )
}
