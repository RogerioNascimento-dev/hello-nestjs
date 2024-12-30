import { QuestionDetails } from '@/domain/forum/enterprise/entities/value-objects/question-details'
import { AttachmentPresenter } from './attachment-presenter'

export class QuestionDetailsPresenter {
  static toHTTP(questionDetail: QuestionDetails) {
    return {
      questionId: questionDetail.questionId.toString(),
      authorId: questionDetail.authorId.toString(),
      authorName: questionDetail.author,
      title: questionDetail.title,
      slug: questionDetail.slug.value,
      content: questionDetail.content,
      bastAnswerId: questionDetail.bastAnswerId?.toString(),
      attachments: questionDetail.attachments.map(AttachmentPresenter.toHTTP),
      createdAt: questionDetail.createdAt,
      updatedAt: questionDetail.updatedAt,
    }
  }
}
