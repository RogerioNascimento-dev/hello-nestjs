import { z } from 'zod'

export const editQuestionRequestValidator = z.object({
  title: z.string(),
  content: z.string(),
})

export type EditQuestionRequestValidator = z.infer<
  typeof editQuestionRequestValidator
>
