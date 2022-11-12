import { Button, Menu, MenuItem, Select, SelectChangeEvent } from '@mui/material'
import { useState } from 'react'
import { IGroupsService } from '../../data/Groups/groups.service'
import { CustomOpGroup, OperationGroup } from '../../data/Groups/types'
import { AddGroupDialog } from '../AddGroup/AddGroupDialog'
import { useObservable } from '../hooks'

import styles from './GroupSelect.module.css'

type Props = {
  selectedGroup: OperationGroup | null
  groupsService: IGroupsService
  onChange: (group: OperationGroup | null) => void
}

export const GroupSelect = ({
  selectedGroup,
  groupsService,
  onChange,
}: Props) => {
  const operationGroups = useObservable(groupsService.groups$, [])
  const [dialogOpen, setDialogOpen] = useState(false)
  const onClickAddGroup = () => {
    setDialogOpen(true)
  }

  const onSelect = (event: SelectChangeEvent<string>) => {
    const name = event.target.value;
    console.log(name)

    const newGroup = operationGroups.find(group => group.name === name)
    onChange(newGroup || null)
  }

  console.log(selectedGroup);

  const onDialogClose = (newGroup: CustomOpGroup) => {
    onChange(newGroup)
    groupsService.addGroup(newGroup)
    setDialogOpen(false)
  }

  return (
    <>
      <Select
        value={selectedGroup?.name}
        renderValue={() => selectedGroup?.emoji}
        onChange={onSelect}
      >
        {operationGroups.map((t) => (
          <MenuItem key={t.name} value={t.name}>
            <div className={styles.emoji}>{t.emoji}</div>
            <div>{t.name}</div>
          </MenuItem>
        ))}

        {/**
         * add custom group creation button
         */}
        <MenuItem
          key="add-group"
          value={'new'}
          onClick={onClickAddGroup}
        >
          <Button type="button" variant="outlined">
            Add new group
          </Button>
        </MenuItem>
      </Select>

      <AddGroupDialog
        isOpen={dialogOpen}
        onClose={onDialogClose}
      ></AddGroupDialog>
    </>
  )
}
