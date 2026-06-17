import { Effect } from 'effect'
import bcrypt from 'bcrypt'
import * as Errors from '../lib/errors'

export class HashService extends Effect.Service<HashService>()('HashService', {
  sync: () => ({
    hash: (
      password: string,
    ): Effect.Effect<string, Errors.InternalServerError> =>
      Effect.tryPromise({
        try: () => bcrypt.hash(password, 10),
        catch: (e) => new Errors.InternalServerError({ cause: e }),
      }),

    verify: (
      password: string,
      hash: string,
    ): Effect.Effect<boolean, Errors.InternalServerError> =>
      Effect.tryPromise({
        try: () => bcrypt.compare(password, hash),
        catch: (e) => new Errors.InternalServerError({ cause: e }),
      }),
  }),
}) {}
