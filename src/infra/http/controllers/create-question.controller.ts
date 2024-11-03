import { CreateQuestionUseCase } from '@/domain/forum/application/use-cases/create-question'
import { CurrentUser } from '@/infra/auth/corrent-user.decorator'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { AuthUser } from '@/infra/auth/validators/jwt-header.validator'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import {
  BadRequestException,
  Body,
  Controller,
  Post,
  UseGuards,
} from '@nestjs/common'
import {
  CreateQuestionRequestValidator,
  createQuestionRequestValidator,
} from './validators/create-question-request.validator'

@Controller('/questions')
@UseGuards(JwtAuthGuard)
export class CreateQuestionController {
  constructor(private createQuestionUseCase: CreateQuestionUseCase) {}
  @Post()
  async handler(
    @Body(new ZodValidationPipe(createQuestionRequestValidator))
    body: CreateQuestionRequestValidator,
    @CurrentUser() user: AuthUser,
  ) {
    const { title, content } = body
    const userId = user.sub

    const result = await this.createQuestionUseCase.execute({
      title,
      content,
      authorId: userId,
      attachmentsIds: [],
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }
  }
}
