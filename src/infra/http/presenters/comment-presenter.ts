import { Comment } from '@/domain/forum/enterprise/entities/comment'

export class CommentPresenter {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static toHTTP(question: Comment<any>) {
    return {
      id: question.id.toString(),
      content: question.content,
      authorId: question.authorId.toString(),
      createdAt: question.createdAt,
      updatedAt: question.updatedAt,
    }
  }
}
