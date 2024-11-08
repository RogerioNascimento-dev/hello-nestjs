import { z } from 'zod'

export const editAnswerQuestionRequestValidator = z.object({
  content: z.string(),
})

export type EditAnswerQuestionRequestValidator = z.infer<
  typeof editAnswerQuestionRequestValidator
>
