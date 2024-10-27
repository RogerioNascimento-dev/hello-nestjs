import { z } from 'zod'

export const createQuestionRequestValidator = z.object({
  title: z.string(),
  content: z.string(),
})

export type CreateQuestionRequestValidator = z.infer<
  typeof createQuestionRequestValidator
>
