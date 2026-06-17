import { Data } from 'effect'

export class UserAlreadyExistsError extends Data.TaggedError(
  'UserAlreadyExistsError',
)<{}> {}
export class InvalidCredentialsError extends Data.TaggedError(
  'InvalidCredentialsError',
)<{}> {}
export class UnauthorizedError extends Data.TaggedError(
  'UnauthorizedError',
)<{}> {}
export class ValidationError extends Data.TaggedError('ValidationError')<{
  readonly message: string
}> {}
export class InternalServerError extends Data.TaggedError(
  'InternalServerError',
)<{ readonly cause: unknown }> {}

export type AppError =
  | UserAlreadyExistsError
  | InvalidCredentialsError
  | UnauthorizedError
  | ValidationError
  | InternalServerError
