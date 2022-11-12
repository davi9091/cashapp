import { DependencyList, useEffect, useMemo, useState } from 'react'
import {Observable} from 'rxjs'
import { AuthError } from '../data/user/types'
import { getAllCurrencies } from '../data/user/utils/currencies'

export const useMemoizedCurrencies = () => useMemo(getAllCurrencies, [])

export const useObservable = <T>(obs: Observable<T>, defaultValue: T) => {
  const [value, setValue] = useState<T>(defaultValue)

  useEffect(() => {
    const subscription = obs.subscribe(setValue)

    return () => subscription.unsubscribe()
  }, [obs])

  return value
}

export const useLoading = (callback?: () => void, deps?: DependencyList) => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    error !== null && setError(null)
  }, deps)

  return {
    loading,
    error,
    trigger: <T>(promise: Promise<T>) => {
      setLoading(true)
      promise
        .then(() => {
          setLoading(false)
          callback?.()
        })
        .catch((error: AuthError) => {
          setError(
            error.wrongPass
              ? 'Wrong username or password'
              : `Unknown error: ${error.error?.message}`,
          )
          setLoading(false)
          if (error.error) throw error.error
        })
    },
  }
}
