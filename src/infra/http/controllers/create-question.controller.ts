import { CreateQuestionUseCase } from '@/domain/forum/application/use-cases/create-question'
import { CurrentUser } from '@/infra/auth/corrent-user.decorator'
import { AuthUser } from '@/infra/auth/validators/jwt-header.validator'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { BadRequestException, Body, Controller, Post } from '@nestjs/common'
import {
  CreateQuestionRequestValidator,
  createQuestionRequestValidator,
} from './validators/create-question-request.validator'

@Controller('/questions')
export class CreateQuestionController {
  constructor(private createQuestionUseCase: CreateQuestionUseCase) {}
  @Post()
  async handler(
    @Body(new ZodValidationPipe(createQuestionRequestValidator))
    body: CreateQuestionRequestValidator,
    @CurrentUser() user: AuthUser,
  ) {
    const { title, content, attachments } = body
    const userId = user.sub

    const result = await this.createQuestionUseCase.execute({
      title,
      content,
      authorId: userId,
      attachmentsIds: attachments,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }
  }
}
