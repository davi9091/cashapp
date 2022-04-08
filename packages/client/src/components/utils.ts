import React from 'react'

type OnInputChangeType = <T extends HTMLInputElement>(
  callback: (value: string) => unknown,
) => (event: React.ChangeEvent<T>) => void
export const onInputChange: OnInputChangeType = (callback) => (event) => {
  callback(event.target.value)
}
