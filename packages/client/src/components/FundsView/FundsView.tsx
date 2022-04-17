import { Button } from '@mui/material'
import React from 'react'
import { useState, useEffect } from 'react'
import { IFundsService } from '../../data/funds/funds.service'
import { AddFund, Fund } from '../../data/funds/types'
import { Currency, IDType } from '../../data/user/types'
import { AddFundDialog } from '../AddFund/AddFundDialog'
import { FundsList } from '../FundsList/FundsList'

import styles from './FundsView.module.css'

type Props = {
  fundsService: IFundsService
}
export const FundsView: React.FC<Props> = ({
  fundsService,
}) => {
  const [isAddFundDialogOpen, setIsAddFundDialogOpen] = useState(false)
  const [activeFund, setActiveFund] = useState<Fund | null>(null)
  const [funds, setFunds] = useState<Record<string, Fund>>({})
  const [editedFund, setEditedFund] = useState<Fund | null>(null)

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

    if (newFund.id) {
      await fundsService.editFund(newFund, saveAndSelect)
    } else {
      await fundsService.addFunds(newFund, saveAndSelect)
    }

    setEditedFund(null)
    return setIsAddFundDialogOpen(false)
  }

  const handleSelectFund = (fund: Fund) => fundsService.selectedFund$.next(fund)
  const handleRemoveFund = (fundId: IDType) => fundsService.removeFund(fundId)
  const handleFundChange = (fund: Fund) => {
    setEditedFund(fund)
    setIsAddFundDialogOpen(true)
  }

  return (
    <div className={styles.container}>
      <div className={styles.view}>
        {activeFund ? (
          <div className={styles.fundsContainer}>
            <FundsList
              allFunds={funds}
              activeFund={activeFund}
              onSelectActive={handleSelectFund}
              onRemoveFund={handleRemoveFund}
              onChangeFund={handleFundChange}
            />
          </div>
        ) : null}

        <Button type="button" variant="outlined" onClick={handleOpen}>
          Create new fund
        </Button>

        <AddFundDialog
          isOpen={isAddFundDialogOpen}
          onClose={handleClose}
          fund={editedFund}
        />
      </div>
    </div>
  )
}
