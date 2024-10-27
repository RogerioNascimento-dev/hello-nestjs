import { z } from 'zod'

export const createQuestionRequestValidator = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string().min(6),
})

export type CreateQuestionRequestValidator = z.infer<
  typeof createQuestionRequestValidator
>
