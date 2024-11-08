import { DeleteAnswerUseCase } from '@/domain/forum/application/use-cases/delete-answer'
import { CurrentUser } from '@/infra/auth/corrent-user.decorator'
import { AuthUser } from '@/infra/auth/validators/jwt-header.validator'
import {
  BadRequestException,
  Controller,
  Delete,
  HttpCode,
  Param,
} from '@nestjs/common'

@Controller('/answers/:id')
export class DeleteAnswerController {
  constructor(private deleteAnswerUseCase: DeleteAnswerUseCase) {}
  @Delete()
  @HttpCode(204)
  async handler(@CurrentUser() user: AuthUser, @Param('id') answerId: string) {
    const userId = user.sub
    const result = await this.deleteAnswerUseCase.execute({
      authorId: userId,
      answerId,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }
  }
}
