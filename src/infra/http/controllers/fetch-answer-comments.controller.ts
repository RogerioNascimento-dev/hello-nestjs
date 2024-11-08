import { FetchAnswerCommentsUseCase } from '@/domain/forum/application/use-cases/fetch-answer-comments'
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

@Controller('/answers/:answerId/comments')
export class FetchAnswerCommentsController {
  constructor(private fetchAnswerComments: FetchAnswerCommentsUseCase) {}
  @Get()
  async handler(
    @Query('page', pageQueryParamsPipe) page: PageQueryParams,
    @Param('answerId') answerId: string,
  ) {
    const result = await this.fetchAnswerComments.execute({
      page,
      answerId,
    })
    if (result.isLeft()) {
      throw new BadRequestException()
    }
    const { answerComments } = result.value

    return {
      answerComments: answerComments.map(CommentPresenter.toHTTP),
    }
  }
}
