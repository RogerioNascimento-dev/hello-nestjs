import { z } from 'zod'

export const jwtHeaderValidator = z.object({
  sub: z.string().uuid(),
})

export type JwtHeaderValidator = z.infer<typeof jwtHeaderValidator>
