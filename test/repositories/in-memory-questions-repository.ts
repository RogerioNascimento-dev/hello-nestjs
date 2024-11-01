import { DomainEvents } from '@/core/events/domain-events'
import { PaginateParams } from '@/core/repositories/paginate-params'
import { IQuestionAttachmentsRepository } from '@/domain/forum/application/repositories/question-attachments-repository'
import { IQuestionsRepository } from '@/domain/forum/application/repositories/questions-repository'
import { Question } from '@/domain/forum/enterprise/entities/question'

export class InMemoryQuestionsRepository implements IQuestionsRepository {
  public items: Question[] = []
  private perPage = 10

  constructor(
    private questionAttachmentsRepository: IQuestionAttachmentsRepository,
  ) {}

  async create(question: Question) {
    this.items.push(question)
    DomainEvents.dispatchEventsForAggregate(question.id)
  }

  async save(question: Question) {
    const index = this.items.findIndex((item) => item.id === question.id)
    this.items[index] = question
    DomainEvents.dispatchEventsForAggregate(question.id)
  }

  async findBySlug(slug: string) {
    const question = this.items.find((item) => item.slug.value === slug)

    if (!question) {
      return null
    }

    return question
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
