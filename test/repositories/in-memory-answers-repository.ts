import { DomainEvents } from '@/core/events/domain-events'
import { PaginateParams } from '@/core/repositories/paginate-params'
import { IAnswerAttachmentsRepository } from '@/domain/forum/application/repositories/answer-attachments-repository'
import { IAnswersRepository } from '@/domain/forum/application/repositories/answers-repository'
import { Answer } from '@/domain/forum/enterprise/entities/answer'

export class InMemoryAnswersRepository implements IAnswersRepository {
  public items: Answer[] = []
  private perPage = 10

  constructor(
    private answerAttachmentsRepository: IAnswerAttachmentsRepository,
  ) {}

  async findById(answerId: string) {
    const answer = this.items.find((item) => item.id.toString() === answerId)
    if (!answer) {
      return null
    }
    return answer
  }

  async save(answer: Answer) {
    const index = this.items.findIndex((item) => item.id === answer.id)
    this.items[index] = answer
    DomainEvents.dispatchEventsForAggregate(answer.id)
  }

  async delete(answer: Answer) {
    const index = this.items.findIndex((item) => item.id === answer.id)
    this.items.splice(index, 1)
    await this.answerAttachmentsRepository.deleteManyByAnswerId(
      answer.id.toString(),
    )
  }

  async create(answer: Answer) {
    this.items.push(answer)
    DomainEvents.dispatchEventsForAggregate(answer.id)
  }

  async findManyByQuestionId(questionId: string, { page }: PaginateParams) {
    const answers = this.items
      .filter((item) => item.questionId.toString() === questionId)
      .slice((page - 1) * this.perPage, page * this.perPage)
    return answers
  }
}
