import { Currency } from '../types'

type GetDefaultCurrency = () => Currency
export const getDefaultCurrency: GetDefaultCurrency = () => ({
  id: '0',
  name: 'US Dollar',
  shortName: 'USD',
  sign: '$',
})

type GetAllCurrencies = () => Currency[]
export const getAllCurrencies: GetAllCurrencies = () => [
  {
    id: '0',
    name: 'US Dollar',
    shortName: 'USD',
    sign: '$',
  },
  {
    id: '1',
    name: 'Euro',
    shortName: 'EUR',
    sign: '€',
  },
  {
    id: '2',
    name: 'Russian Rouble',
    shortName: 'RUB',
    sign: '₽',
  },
  {
    id: '3',
    name: 'Armenian Dram',
    shortName: 'AMD',
    sign: '֏',
  },
]
