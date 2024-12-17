import { PaginateParams } from '@/core/repositories/paginate-params'
import { IAnswerCommentsRepository } from '@/domain/forum/application/repositories/answer-comments-repository'
import { AnswerComment } from '@/domain/forum/enterprise/entities/answer-comment'

export class InMemoryAnswerCommentRepository
  implements IAnswerCommentsRepository
{
  public items: AnswerComment[] = []
  private perPage = 10

  async create(answerComment: AnswerComment) {
    this.items.push(answerComment)
  }

  async findManyByAnswerId(answerId: string, { page }: PaginateParams) {
    const questionComments = this.items
      .filter((item) => item.answerId.toValue() === answerId)
      .slice((page - 1) * this.perPage, page * this.perPage)
    return questionComments
  }

  async findById(id: string) {
    const questionComment = this.items.find((item) => item.id.toValue() === id)
    if (!questionComment) {
      return null
    }
    return questionComment
  }

  async delete(questionComment: AnswerComment) {
    const index = this.items.findIndex((item) => item.id === questionComment.id)
    this.items.splice(index, 1)
  }
}
