import { OPERATION_GROUPS } from '../funds/enums'

export const emojiMap: Record<OPERATION_GROUPS, string> = {
  [OPERATION_GROUPS.GROCERY]: '🛒',
  [OPERATION_GROUPS.FUEL]: '⛽',
  [OPERATION_GROUPS.NONE]: '➖',
  [OPERATION_GROUPS.ADD_NEW]: '➖',
  [OPERATION_GROUPS.SALARY]: '💵',
}
