import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { z } from 'zod'

export const pageQueryParams = z
  .string()
  .optional()
  .default('1')
  .transform(Number)
  .pipe(z.number().min(1))

export type PageQueryParams = z.infer<typeof pageQueryParams>

export const pageQueryParamsPipe = new ZodValidationPipe(pageQueryParams)
