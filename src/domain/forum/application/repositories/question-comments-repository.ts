import { PaginateParams } from '@/core/repositories/paginate-params'
import { QuestionComment } from '../../enterprise/entities/question-comment'

export interface IQuestionCommentRepository {
  create(questionComment: QuestionComment): Promise<void>
  findById(id: string): Promise<QuestionComment | null>
  delete(questionComment: QuestionComment): Promise<void>
  findManyByQuestionId(
    questionId: string,
    params: PaginateParams,
  ): Promise<QuestionComment[]>
}
