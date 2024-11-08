import { z } from 'zod'

export const createAnswerQuestionRequestValidator = z.object({
  content: z.string(),
})

export type CreateAnswerQuestionRequestValidator = z.infer<
  typeof createAnswerQuestionRequestValidator
>
