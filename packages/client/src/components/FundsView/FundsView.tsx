import { Button } from '@mui/material'
import React from 'react'
import { useState, useEffect } from 'react'
import { IFundsService } from '../../data/funds/funds.service'
import { AddFund, Fund } from '../../data/funds/types'
import { Currency } from '../../data/user/types'
import { AddFundDialog } from '../AddFund/AddFundDialog'
import { FundsList } from '../FundsList/FundsList'

import styles from './FundsView.module.css'

type Props = {
  fundsService: IFundsService
  defaultCurrency: Currency
}
export const FundsView: React.FC<Props> = ({
  fundsService,
  defaultCurrency,
}) => {
  const [isAddFundDialogOpen, setIsAddFundDialogOpen] = useState(false)
  const [activeFund, setActiveFund] = useState<Fund>()
  const [funds, setFunds] = useState<Record<string, Fund>>({})

  useEffect(() => {
    const allFundsSub = fundsService.funds$.subscribe((funds) =>
      setFunds(funds),
    )

    const selectedSub = fundsService.selectedFund$.subscribe(
      (nextFund) => nextFund && setActiveFund(nextFund),
    )

    return () => {
      allFundsSub.unsubscribe()
      selectedSub.unsubscribe()
    }
  }, [fundsService, setActiveFund])

  const handleOpen = () => {
    setIsAddFundDialogOpen(true)
  }

  const handleClose = async (
    newFund: AddFund | null,
    saveAndSelect?: boolean,
  ) => {
    if (!newFund) return setIsAddFundDialogOpen(false)

    const createdFund = await fundsService.addFunds(newFund, saveAndSelect)
    console.log(createdFund)

    return setIsAddFundDialogOpen(false)
  }

  const handleSelectFund = (fund: Fund) => fundsService.selectedFund$.next(fund)

  return (
    <div>
      {activeFund ? (
        <div className={styles.view}>

          <div className={styles.fundsContainer}>
            <FundsList
              allFunds={funds}
              activeFund={activeFund}
              onSelectActive={handleSelectFund}
            />
          </div>
        </div>
      ) : null}

      <Button type="button" variant="outlined" onClick={handleOpen}>
        Create new fund
      </Button>
      <AddFundDialog
        defaultCurrency={defaultCurrency}
        isOpen={isAddFundDialogOpen}
        onClose={handleClose}
      />
    </div>
  )
}
