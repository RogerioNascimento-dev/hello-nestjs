import { z } from 'zod'

export const createQuestionRequest = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string().min(6),
})

export type CreateQuestionRequest = z.infer<typeof createQuestionRequest>
