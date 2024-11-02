import { PaginateParams } from '@/core/repositories/paginate-params'
import { Question } from '../../enterprise/entities/question'

export abstract class IQuestionsRepository {
  abstract create(question: Question): Promise<void>
  abstract save(question: Question): Promise<void>
  abstract delete(question: Question): Promise<void>
  abstract findBySlug(slug: string): Promise<Question | null>
  abstract findById(id: string): Promise<Question | null>
  abstract findManyRecent(params: PaginateParams): Promise<Question[]>
}
