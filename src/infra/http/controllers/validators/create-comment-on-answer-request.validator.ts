import { z } from 'zod'

export const createCommentOnAnswerRequestValidator = z.object({
  content: z.string(),
})

export type CreateCommentOnAnswerRequestValidator = z.infer<
  typeof createCommentOnAnswerRequestValidator
>
