import { Answer } from '@/domain/forum/enterprise/entities/answer'

export class AnswerPresenter {
  static toHTTP(question: Answer) {
    return {
      id: question.id.toString(),
      content: question.content,
      authorId: question.authorId.toString(),
      createdAt: question.createdAt,
      updatedAt: question.updatedAt,
    }
  }
}
