import { PaginateParams } from '@/core/repositories/paginate-params'
import { Answer } from '@/domain/forum/enterprise/entities/answer'

export abstract class IAnswersRepository {
  abstract create(answer: Answer): Promise<void>
  abstract save(answer: Answer): Promise<void>
  abstract delete(answer: Answer): Promise<void>
  abstract findById(answerId: string): Promise<Answer | null>
  abstract findManyByQuestionId(
    questionId: string,
    params: PaginateParams,
  ): Promise<Answer[]>
}
