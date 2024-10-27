import { z } from 'zod'

export const authenticateRequest = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

export type AuthenticateRequest = z.infer<typeof authenticateRequest>
