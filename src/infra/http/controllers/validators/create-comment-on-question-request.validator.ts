import { z } from 'zod'

export const createCommentOnQuestionRequestValidator = z.object({
  content: z.string(),
})

export type CreateCommentOnQuestionRequestValidator = z.infer<
  typeof createCommentOnQuestionRequestValidator
>
