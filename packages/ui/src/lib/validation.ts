export type RegisterFieldErrors = {
  email?: string
  password?: string
}

export const validateRegisterForm = (
  email: string,
  password: string,
): RegisterFieldErrors => {
  const errors: RegisterFieldErrors = {}
  if (email.trim().length === 0 || !email.includes("@")) {
    errors.email = "Must be a valid email address"
  }
  if (password.length < 8) {
    errors.password = "Must be at least 8 characters"
  }
  return errors
}

export const hasErrors = (errors: RegisterFieldErrors): boolean =>
  Object.values(errors).some((v) => v !== undefined)
