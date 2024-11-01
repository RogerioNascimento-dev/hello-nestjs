import { z } from 'zod'

export const createAccountRequestValidator = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string().min(6),
})

export type CreateAccountRequestValidator = z.infer<
  typeof createAccountRequestValidator
>
