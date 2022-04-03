import { OperationGroup } from './types'

export enum OPERATION_GROUPS {
  NONE = 'none',
  GROCERY = 'grocery',
  FUEL = 'fuel',
  SALARY = 'salary',
}

export const getOperationGroups: () => Record<
  OPERATION_GROUPS,
  OperationGroup
> = () => ({
  [OPERATION_GROUPS.NONE]: {
    name: 'No',
    defaultLabel: 'General',
  },
  [OPERATION_GROUPS.GROCERY]: {
    name: 'Grocery',
    defaultLabel: 'Grocery shopping',
  },
  [OPERATION_GROUPS.FUEL]: {
    name: 'Fuel',
    defaultLabel: 'Fuel',
  },
  [OPERATION_GROUPS.SALARY]: {
    name: 'Salary',
    defaultLabel: 'Salary',
  },
})
