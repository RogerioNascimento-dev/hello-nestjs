import { PaginateParams } from '@/core/repositories/paginate-params'
import { IAnswerCommentsRepository } from '@/domain/forum/application/repositories/answer-comments-repository'
import { AnswerComment } from '@/domain/forum/enterprise/entities/answer-comment'
import { CommentWithAuthor } from '@/domain/forum/enterprise/entities/value-objects/comment-with-author'
import { InMemoryStudentsRepository } from './in-memory-students-repository'

export class InMemoryAnswerCommentRepository
  implements IAnswerCommentsRepository
{
  constructor(private inMemoryStudentsRepository: InMemoryStudentsRepository) {}
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

  async findManyByAnswerIdWithAuthor(
    answerId: string,
    { page }: PaginateParams,
  ) {
    const questionComments = this.items
      .filter((item) => item.answerId.toValue() === answerId)
      .slice((page - 1) * this.perPage, page * this.perPage)
      .map((comment) => {
        const author = this.inMemoryStudentsRepository.items.find((student) =>
          student.id.equals(comment.authorId),
        )
        if (!author) {
          throw new Error(
            `Author with id ${comment.authorId.toString()} does not found.`,
          )
        }
        return CommentWithAuthor.create({
          content: comment.content,
          commentId: comment.id,
          createdAt: comment.createdAt,
          updatedAt: comment.updatedAt,
          authorId: comment.authorId,
          author: author.name,
        })
      })
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
