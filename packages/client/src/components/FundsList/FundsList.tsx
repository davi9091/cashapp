import React from 'react'
import { Fund } from '../../data/funds/types'
import {IDType} from '../../data/user/types'
import { AvailableFundsComponent } from '../AvailableFunds/AvailableFunds'

import styles from './FundsList.module.css'

function notEmpty<T>(value: T | null | undefined): value is T {
  return value !== null && value !== undefined
}

type Props = {
  allFunds: Record<string, Fund>
  activeFund: Fund
  onSelectActive: (selectedFund: Fund) => void
  onRemoveFund: (fundId: IDType) => void
  onChangeFund: (fund: Fund) => void
}

export const FundsList: React.FC<Props> = ({
  allFunds,
  activeFund,
  onSelectActive,
  onRemoveFund,
  onChangeFund,
}) => {
  const fundsExceptActive = Object.values({
    ...allFunds,
    [activeFund.id]: null,
  }).filter(notEmpty)

  const handleFundClick = (fund?: Fund) => (event: React.MouseEvent) => {
    event.preventDefault()

    return fund && onSelectActive(fund)
  }

  const handleFundRemove = (fundId: IDType) => (event: React.MouseEvent) => {
    event.preventDefault()

    return onRemoveFund(fundId)
  }

  const handleFundChange = (fund: Fund) => (event: React.MouseEvent) => {
    event.preventDefault()

    return onChangeFund(fund)
  }

  return (
    <div className={styles.list}>
      <div className={styles.activeFund}>
        <AvailableFundsComponent
          preventFocus
          funds={activeFund}
          className={styles.activeFund}
          onClick={handleFundClick()}
          onRemove={handleFundRemove(activeFund.id)}
          onChange={handleFundChange(activeFund)}

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
            funds={fund}
            onClick={handleFundClick(fund)}
            onRemove={handleFundRemove(fund.id)}
            onChange={handleFundChange(fund)}

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
