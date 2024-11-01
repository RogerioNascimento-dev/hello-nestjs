import { PaginateParams } from '@/core/repositories/paginate-params'
import { IQuestionCommentRepository } from '@/domain/forum/application/repositories/question-comments-repository'
import { QuestionComment } from '@/domain/forum/enterprise/entities/question-comment'

export class InMemoryQuestionCommentRepository
  implements IQuestionCommentRepository
{
  public items: QuestionComment[] = []
  private perPage = 10
  async findById(id: string) {
    const questionComment = this.items.find((item) => item.id.toValue() === id)
    if (!questionComment) {
      return null
    }
    return questionComment
  }

  async findManyByQuestionId(questionId: string, { page }: PaginateParams) {
    const questionComments = this.items
      .filter((item) => item.questionId.toValue() === questionId)
      .slice((page - 1) * this.perPage, page * this.perPage)
    return questionComments
  }

  async delete(questionComment: QuestionComment) {
    const index = this.items.findIndex((item) => item.id === questionComment.id)
    this.items.splice(index, 1)
  }

  async create(questionComment: QuestionComment) {
    this.items.push(questionComment)
  }
}
