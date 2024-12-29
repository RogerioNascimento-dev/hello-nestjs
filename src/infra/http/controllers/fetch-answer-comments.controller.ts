import { FetchAnswerCommentsUseCase } from '@/domain/forum/application/use-cases/fetch-answer-comments'
import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Query,
} from '@nestjs/common'
import { CommentWithAuthorPresenter } from '../presenters/comment-with-author-presenter'
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
    const { comments } = result.value

    return {
      comments: comments.map(CommentWithAuthorPresenter.toHTTP),
    }
  }
}
