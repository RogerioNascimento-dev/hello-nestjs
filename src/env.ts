import { z } from 'zod'

export const envValidator = z.object({
  DATABASE_URL: z.string().url(),
  JWT_PUBLIC_KEY: z.string(),
  JWT_PRIVATE_KEY: z.string(),
  PORT: z.coerce.number().optional().default(3333),
})

export type Env = z.infer<typeof envValidator>
