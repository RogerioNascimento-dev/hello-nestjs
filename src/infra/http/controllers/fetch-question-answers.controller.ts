import { FetchQuestionAnswersUseCase } from '@/domain/forum/application/use-cases/fetch-question-answers'
import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Query,
} from '@nestjs/common'
import { AnswerPresenter } from '../presenters/answer-presenter'
import {
  PageQueryParams,
  pageQueryParamsPipe,
} from './validators/fetch-recent-questions-request.validator'

@Controller('/questions/:questionId/answers')
export class FetchQuestionAnswersController {
  constructor(private fetchQuestionAnswers: FetchQuestionAnswersUseCase) {}
  @Get()
  async handler(
    @Query('page', pageQueryParamsPipe) page: PageQueryParams,
    @Param('questionId') questionId: string,
  ) {
    const result = await this.fetchQuestionAnswers.execute({ page, questionId })
    if (result.isLeft()) {
      throw new BadRequestException()
    }
    const { answers } = result.value

    return {
      answers: answers.map(AnswerPresenter.toHTTP),
    }
  }
}
