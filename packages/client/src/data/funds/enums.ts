import { OperationGroup } from './types'

export enum OPERATION_GROUPS {
  NONE = 'none',
  GROCERY = 'grocery',
  FUEL = 'fuel',
  SALARY = 'salary',
  ADD_NEW = 'addNew',
}

export const getOperationGroups: () => Record<
  OPERATION_GROUPS,
  OperationGroup
> = () => ({
  [OPERATION_GROUPS.NONE]: {
    type: OPERATION_GROUPS.NONE,
    name: 'No',
    defaultLabel: 'General',
  },
  [OPERATION_GROUPS.GROCERY]: {
    type: OPERATION_GROUPS.GROCERY,
    name: 'Grocery',
    defaultLabel: 'Grocery shopping',
  },
  [OPERATION_GROUPS.FUEL]: {
    type: OPERATION_GROUPS.FUEL,
    name: 'Fuel',
    defaultLabel: 'Fuel',
  },
  [OPERATION_GROUPS.SALARY]: {
    type: OPERATION_GROUPS.SALARY,
    name: 'Salary',
    defaultLabel: 'Salary',
  },
  [OPERATION_GROUPS.ADD_NEW]: {
    type: OPERATION_GROUPS.ADD_NEW,
    name: 'Add new',
    defaultLabel: 'add new',
  },
})
