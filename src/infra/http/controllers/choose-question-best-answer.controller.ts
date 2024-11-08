import { ChooseQuestionBestAnswerUseCase } from '@/domain/forum/application/use-cases/choose-question-best-answer'
import { CurrentUser } from '@/infra/auth/corrent-user.decorator'
import { AuthUser } from '@/infra/auth/validators/jwt-header.validator'
import {
  BadRequestException,
  Controller,
  HttpCode,
  Param,
  Patch,
} from '@nestjs/common'

@Controller('/answers/:answerId/choose-as-bast')
export class ChooseQuestionBestAnswerController {
  constructor(
    private chooseQuestionBestAnswerUseCase: ChooseQuestionBestAnswerUseCase,
  ) {}

  @Patch()
  @HttpCode(204)
  async handler(
    @CurrentUser() user: AuthUser,
    @Param('answerId') answerId: string,
  ) {
    const userId = user.sub
    const result = await this.chooseQuestionBestAnswerUseCase.execute({
      authorId: userId,
      answerId,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }
  }
}
