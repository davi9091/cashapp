import { Effect } from 'effect'
import * as Errors from '../lib/errors'

export const parseJsonBody = (req: Request) =>
  Effect.tryPromise({
    try: () => req.json(),
    catch: () => new Errors.ValidationError({ message: 'Invalid JSON body' }),
  })
