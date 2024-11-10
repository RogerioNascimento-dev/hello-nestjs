import { z } from 'zod'

export const createQuestionRequestValidator = z.object({
  title: z.string(),
  content: z.string(),
  attachments: z.array(z.string().uuid()),
})

export type CreateQuestionRequestValidator = z.infer<
  typeof createQuestionRequestValidator
>
