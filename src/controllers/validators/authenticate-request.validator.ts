import { z } from 'zod'

export const authenticateRequestValidator = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

export type AuthenticateRequestValidator = z.infer<
  typeof authenticateRequestValidator
>
