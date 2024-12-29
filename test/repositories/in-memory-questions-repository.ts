import { DomainEvents } from '@/core/events/domain-events'
import { PaginateParams } from '@/core/repositories/paginate-params'
import { IQuestionsRepository } from '@/domain/forum/application/repositories/questions-repository'
import { Question } from '@/domain/forum/enterprise/entities/question'
import { QuestionDetails } from '@/domain/forum/enterprise/entities/value-objects/question-details'
import { InMemoryAttachmentsRepository } from './in-memory-attachments-repository'
import { InMemoryQuestionAttachmentsRepository } from './in-memory-question-attachments-repository'
import { InMemoryStudentsRepository } from './in-memory-students-repository'

export class InMemoryQuestionsRepository implements IQuestionsRepository {
  public items: Question[] = []
  private perPage = 10

  constructor(
    private questionAttachmentsRepository: InMemoryQuestionAttachmentsRepository,
    private attachmentsRepository: InMemoryAttachmentsRepository,
    private studentsRepository: InMemoryStudentsRepository,
  ) {}

  async create(question: Question) {
    this.items.push(question)
    await this.questionAttachmentsRepository.createMany(
      question.attachments.getItems(),
    )
    DomainEvents.dispatchEventsForAggregate(question.id)
  }

  async save(question: Question) {
    const index = this.items.findIndex((item) => item.id === question.id)
    this.items[index] = question

    await this.questionAttachmentsRepository.createMany(
      question.attachments.getNewItems(),
    )

    await this.questionAttachmentsRepository.deleteMany(
      question.attachments.getRemovedItems(),
    )

    DomainEvents.dispatchEventsForAggregate(question.id)
  }

  async findBySlug(slug: string) {
    const question = this.items.find((item) => item.slug.value === slug)

    if (!question) {
      return null
    }

    return question
  }

  async findBySlugWithDetails(slug: string) {
    const question = this.items.find((item) => item.slug.value === slug)

    if (!question) return null

    const author = await this.studentsRepository.items.find((student) =>
      student.id.equals(question.authorId),
    )

    if (!author) {
      throw new Error(
        `Author with ID ${question.authorId.toString()} does not exist`,
      )
    }

    const questionAttachments = this.questionAttachmentsRepository.items.filter(
      (questionAttachment) => questionAttachment.questionId.equals(question.id),
    )

    const attachments = questionAttachments.map((questionAttachment) => {
      const attachment = this.attachmentsRepository.items.find((attachment) => {
        return attachment.id.equals(questionAttachment.attachmentId)
      })
      if (!attachment) {
        throw new Error(
          `Attachment with ID ${questionAttachment.attachmentId.toString()} does not exist`,
        )
      }
      return attachment
    })

    return QuestionDetails.create({
      questionId: question.id,
      authorId: author.id,
      author: author.name,
      title: question.title,
      content: question.content,
      slug: question.slug,
      bastAnswerId: question.bastAnswerId,
      attachments,
      createdAt: question.createdAt,
      updatedAt: question.updatedAt,
    })
  }

  async delete(question: Question): Promise<void> {
    const index = this.items.findIndex((item) => item.id === question.id)
    this.items.splice(index, 1)
    await this.questionAttachmentsRepository.deleteManyByQuestionId(
      question.id.toValue(),
    )
  }

  async findById(id: string): Promise<Question | null> {
    const question = this.items.find((item) => item.id.toString() === id)
    if (!question) {
      return null
    }
    return question
  }

  async findManyRecent({ page }: PaginateParams) {
    const questions = this.items
      .sort((a, b) => {
        return a.createdAt.getTime() - b.createdAt.getTime()
      })
      .slice((page - 1) * this.perPage, page * this.perPage)
    return questions
  }
}
