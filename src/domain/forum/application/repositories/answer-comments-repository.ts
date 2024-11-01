import { PaginateParams } from '@/core/repositories/paginate-params'
import { AnswerComment } from '../../enterprise/entities/answer-comment'

export interface IAnswerCommentRepository {
  create(answerComment: AnswerComment): Promise<void>
  findById(id: string): Promise<AnswerComment | null>
  delete(answerComment: AnswerComment): Promise<void>
  findManyByAnswerId(
    answerId: string,
    params: PaginateParams,
  ): Promise<AnswerComment[]>
}
