import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { DomainEvent } from '@/core/events/domain-event'
import { Question } from '../question'

export class QuestionBastAnswerChosenEvent implements DomainEvent {
  public ocurredAt: Date
  public question: Question
  public bestAnswerId: UniqueEntityID

  constructor(question: Question, bestAnswerId: UniqueEntityID) {
    this.question = question
    this.bestAnswerId = bestAnswerId
    this.ocurredAt = new Date()
  }

  getAggregateId(): UniqueEntityID {
    return this.question.id
  }
}
