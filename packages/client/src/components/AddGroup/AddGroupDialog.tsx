import { OPERATION_GROUPS } from '../../data/funds/enums';
import { OperationGroup } from '../../data/funds/types';
import { FormDialog } from '../FormDialog/FormDialog'
import { AddGroup } from './AddGroup'

type Props = { isOpen: boolean; onClose: (group: OperationGroup) => void }

export const AddGroupDialog: React.VFC<Props> = ({ isOpen, onClose }) => {
  return (
    <FormDialog open={isOpen} onClose={onClose}>
      <AddGroup></AddGroup>
    </FormDialog>
  )
}
