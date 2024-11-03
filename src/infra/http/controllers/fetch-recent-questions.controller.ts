import { FetchRecentQuestionsUseCase } from '@/domain/forum/application/use-cases/fetch-recent-questions'
import { BadRequestException, Controller, Get, Query } from '@nestjs/common'
import { QuestionPresenter } from '../presenters/question-presenter'
import {
  PageQueryParams,
  pageQueryParamsPipe,
} from './validators/fetch-recent-questions-request.validator'

@Controller('/questions')
export class FetchRecentQuestionsController {
  constructor(private fetchRecentQuestions: FetchRecentQuestionsUseCase) {}
  @Get()
  async handler(@Query('page', pageQueryParamsPipe) page: PageQueryParams) {
    const result = await this.fetchRecentQuestions.execute({ page })
    if (result.isLeft()) {
      throw new BadRequestException()
    }
    const { questions } = result.value

    return {
      questions: questions.map(QuestionPresenter.toHTTP),
    }
  }
}
