import { z } from 'zod'

export const editQuestionRequestValidator = z.object({
  title: z.string(),
  content: z.string(),
  attachments: z.array(z.string().uuid()),
})

export type EditQuestionRequestValidator = z.infer<
  typeof editQuestionRequestValidator
>
