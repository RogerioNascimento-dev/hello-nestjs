import { CurrentUser } from '@/infra/auth/corrent-user.decorator'
import { AuthUser } from '@/infra/auth/validators/jwt-header.validator'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import {
  BadRequestException,
  Body,
  Controller,
  Param,
  Put,
} from '@nestjs/common'

import { EditAnswerUseCase } from '@/domain/forum/application/use-cases/edit-answer'
import { AnswerPresenter } from '../presenters/answer-presenter'
import {
  editAnswerQuestionRequestValidator,
  EditAnswerQuestionRequestValidator,
} from './validators/edit-answer-question-request.validator'

@Controller('/answers/:id')
export class EditAnswerQuestionController {
  constructor(private editAnswerUseCase: EditAnswerUseCase) {}
  @Put()
  async handler(
    @Body(new ZodValidationPipe(editAnswerQuestionRequestValidator))
    body: EditAnswerQuestionRequestValidator,
    @CurrentUser() user: AuthUser,
    @Param('id') answerId: string,
  ) {
    const { content } = body
    const authorId = user.sub

    const result = await this.editAnswerUseCase.execute({
      content,
      answerId,
      authorId,
      attachmentsIds: [],
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }
    const answer = result.value.answer
    return { answer: AnswerPresenter.toHTTP(answer) }
  }
}
