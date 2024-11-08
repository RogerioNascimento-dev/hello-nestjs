import { PaginateParams } from '@/core/repositories/paginate-params'
import { QuestionComment } from '../../enterprise/entities/question-comment'

export abstract class IQuestionCommentsRepository {
  abstract create(questionComment: QuestionComment): Promise<void>
  abstract findById(id: string): Promise<QuestionComment | null>
  abstract delete(questionComment: QuestionComment): Promise<void>
  abstract findManyByQuestionId(
    questionId: string,
    params: PaginateParams,
  ): Promise<QuestionComment[]>
}
