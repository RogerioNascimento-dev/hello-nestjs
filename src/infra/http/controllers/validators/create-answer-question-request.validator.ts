import { z } from 'zod'

export const createAnswerQuestionRequestValidator = z.object({
  content: z.string(),
  attachments: z.array(z.string().uuid()),
})

export type CreateAnswerQuestionRequestValidator = z.infer<
  typeof createAnswerQuestionRequestValidator
>
