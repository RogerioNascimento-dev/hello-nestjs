import { PaginateParams } from '@/core/repositories/paginate-params'
import { Answer } from '@/domain/forum/enterprise/entities/answer'

export interface IAnswersRepository {
  create(answer: Answer): Promise<void>
  save(answer: Answer): Promise<void>
  delete(answer: Answer): Promise<void>
  findById(answerId: string): Promise<Answer | null>
  findManyByQuestionId(
    questionId: string,
    params: PaginateParams,
  ): Promise<Answer[]>
}
