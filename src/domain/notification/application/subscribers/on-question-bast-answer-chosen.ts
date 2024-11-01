import { DomainEvents } from '@/core/events/domain-events'
import { EventHandler } from '@/core/events/event-handler'
import { IAnswersRepository } from '@/domain/forum/application/repositories/answers-repository'
import { QuestionBastAnswerChosenEvent } from '@/domain/forum/enterprise/entities/events/question-bast-answer-chosen-event'
import { SendNotificationUseCase } from '../use-cases/send-notification'

export class OnQuestionBastAnswerChosen implements EventHandler {
  constructor(
    private answersRepository: IAnswersRepository,
    private sendNotification: SendNotificationUseCase,
  ) {
    this.setupSubscriptions()
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      this.sendQuestionBastAnswerNotification.bind(this),
      QuestionBastAnswerChosenEvent.name,
    )
  }

  private async sendQuestionBastAnswerNotification({
    question,
    bestAnswerId,
  }: QuestionBastAnswerChosenEvent) {
    const answer = await this.answersRepository.findById(
      bestAnswerId.toString(),
    )
    if (answer) {
      this.sendNotification.execute({
        recipientId: answer?.authorId.toString(),
        title: `Sua resposta foi escolhida como a melhor`,
        content: `A resposta em ${question.title.substring(0, 20).concat(' ...')} foi escolhida como a melhor resposta pelo autor!`,
      })
    }
  }
}
