import { z } from 'zod'

export const jwtHeaderValidator = z.object({
  sub: z.string().uuid(),
})

export type AuthUser = z.infer<typeof jwtHeaderValidator>
