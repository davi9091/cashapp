import { Button } from '@mui/material'
import styles from './IncomeSwitch.module.css'

type Props = {
  value: boolean
  trueLabel: string
  falseLabel: string
  onChange?: (value: boolean) => void
}

export const TwoWaySwitch = ({
  value,
  onChange,
  trueLabel,
  falseLabel,
}: Props) => {
  return (
    <div className={styles.container}>
      <Button
        className={value ? styles.activeButton : styles.inactiveButton}
        onClick={() => onChange?.(true)}
      >
        {trueLabel}
      </Button>
      <Button
        className={value ? styles.inactiveButton : styles.activeButton}
        onClick={() => onChange?.(false)}
      >
        {falseLabel}
      </Button>
    </div>
  )
}
