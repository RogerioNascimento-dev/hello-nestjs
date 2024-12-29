import { PaginateParams } from '@/core/repositories/paginate-params'
import { IQuestionCommentsRepository } from '@/domain/forum/application/repositories/question-comments-repository'
import { QuestionComment } from '@/domain/forum/enterprise/entities/question-comment'
import { CommentWithAuthor } from '@/domain/forum/enterprise/entities/value-objects/comment-with-author'
import { InMemoryStudentsRepository } from './in-memory-students-repository'

export class InMemoryQuestionCommentRepository
  implements IQuestionCommentsRepository
{
  public items: QuestionComment[] = []
  private perPage = 10

  constructor(private inMemoryStudentsRepository: InMemoryStudentsRepository) {}
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

  async findManyByQuestionIdWithAuthor(
    questionId: string,
    { page }: PaginateParams,
  ) {
    const questionComments = this.items
      .filter((item) => item.questionId.toValue() === questionId)
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
}
