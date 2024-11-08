import { PaginateParams } from '@/core/repositories/paginate-params'
import { AnswerComment } from '../../enterprise/entities/answer-comment'

export abstract class IAnswerCommentsRepository {
  abstract create(answerComment: AnswerComment): Promise<void>
  abstract findById(id: string): Promise<AnswerComment | null>
  abstract delete(answerComment: AnswerComment): Promise<void>
  abstract findManyByAnswerId(
    answerId: string,
    params: PaginateParams,
  ): Promise<AnswerComment[]>
}
