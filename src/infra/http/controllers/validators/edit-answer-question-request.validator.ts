import { z } from 'zod'

export const editAnswerQuestionRequestValidator = z.object({
  content: z.string(),
  attachments: z.array(z.string().uuid()).default([]),
})

export type EditAnswerQuestionRequestValidator = z.infer<
  typeof editAnswerQuestionRequestValidator
>
