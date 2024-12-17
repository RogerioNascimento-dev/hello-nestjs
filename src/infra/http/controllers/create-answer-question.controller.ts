import { CurrentUser } from '@/infra/auth/corrent-user.decorator'
import { AuthUser } from '@/infra/auth/validators/jwt-header.validator'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import {
  BadRequestException,
  Body,
  Controller,
  Param,
  Post,
} from '@nestjs/common'

import { AnswerQuestionUseCase } from '@/domain/forum/application/use-cases/answer-question'
import { AnswerPresenter } from '../presenters/answer-presenter'
import {
  createAnswerQuestionRequestValidator,
  CreateAnswerQuestionRequestValidator,
} from './validators/create-answer-question-request.validator'

@Controller('/questions/:questionId/answers')
export class CreateAnswerQuestionController {
  constructor(private answerQuestionUseCase: AnswerQuestionUseCase) {}
  @Post()
  async handler(
    @Body(new ZodValidationPipe(createAnswerQuestionRequestValidator))
    body: CreateAnswerQuestionRequestValidator,
    @CurrentUser() user: AuthUser,
    @Param('questionId') questionId: string,
  ) {
    const { content, attachments } = body
    const authorId = user.sub

    const result = await this.answerQuestionUseCase.execute({
      content,
      questionId,
      authorId,
      attachmentsIds: attachments,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }
    const answer = result.value.answer
    return { answer: AnswerPresenter.toHTTP(answer) }
  }
}
