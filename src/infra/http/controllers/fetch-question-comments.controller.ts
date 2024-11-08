import { FetchQuestionCommentsUseCase } from '@/domain/forum/application/use-cases/fetch-question-comments'
import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Query,
} from '@nestjs/common'
import { CommentPresenter } from '../presenters/comment-presenter'
import {
  PageQueryParams,
  pageQueryParamsPipe,
} from './validators/fetch-recent-questions-request.validator'

@Controller('/questions/:questionId/comments')
export class FetchQuestionCommentsController {
  constructor(private fetchQuestionComments: FetchQuestionCommentsUseCase) {}
  @Get()
  async handler(
    @Query('page', pageQueryParamsPipe) page: PageQueryParams,
    @Param('questionId') questionId: string,
  ) {
    const result = await this.fetchQuestionComments.execute({
      page,
      questionId,
    })
    if (result.isLeft()) {
      throw new BadRequestException()
    }
    const { questionComments } = result.value

    return {
      questionComments: questionComments.map(CommentPresenter.toHTTP),
    }
  }
}
