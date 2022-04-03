import React from 'react'
import { Fund } from '../../data/funds/types'
import { AvailableFundsComponent } from '../AvailableFunds/AvailableFunds'

import styles from './FundsList.module.css'

function notEmpty<T>(value: T | null | undefined): value is T {
  return value !== null && value !== undefined
}

type Props = {
  allFunds: Record<string, Fund>
  activeFund: Fund
  onSelectActive: (selectedFund: Fund) => void
}

export const FundsList: React.FC<Props> = ({
  allFunds,
  activeFund,
  onSelectActive,
}) => {
  const fundsExceptActive = Object.values({
    ...allFunds,
    [activeFund.id]: null,
  }).filter(notEmpty)

  const handleFundClick = (fund?: Fund) => (event: React.MouseEvent) => {
    event.preventDefault()

    return fund && onSelectActive(fund)
  }

  return (
    <div className={styles.list}>
      <div className={styles.activeFund}>
        <AvailableFundsComponent
          preventFocus
          funds={activeFund}
          className={styles.activeFund}
          onClick={handleFundClick()}
          textFieldProps={{
            variant: 'filled',
            fullWidth: true,
            inputProps: { style: { cursor: 'pointer' } },
          }}
        />
      </div>

      {fundsExceptActive.length > 0 ? (
        <div className={styles.separatorContainer}>
          <div className={styles.verticalSeparator} />{' '}
        </div>
      ) : null}

      {fundsExceptActive.map((fund) => (
        <div key={fund.id}>
          <AvailableFundsComponent
            preventFocus
            onClick={handleFundClick(fund)}
            funds={fund}
            textFieldProps={{
              fullWidth: true,
              inputProps: { style: { cursor: 'pointer' } },
            }}
          />
        </div>
      ))}
    </div>
  )
}
