import { CurrentUser } from '@/infra/auth/corrent-user.decorator'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { AuthUser } from '@/infra/auth/validators/jwt-header.validator'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { Body, Controller, Post, UseGuards } from '@nestjs/common'
import {
  CreateQuestionRequestValidator,
  createQuestionRequestValidator,
} from './validators/create-question-request.validator'

@Controller('/questions')
@UseGuards(JwtAuthGuard)
export class CreateQuestionController {
  constructor(private prisma: PrismaService) {}
  @Post()
  async handler(
    @Body(new ZodValidationPipe(createQuestionRequestValidator))
    body: CreateQuestionRequestValidator,
    @CurrentUser() user: AuthUser,
  ) {
    const { title, content } = body
    const slug = this.convertToSlug(title)
    const userId = user.sub

    await this.prisma.question.create({
      data: { title, content, slug, authorId: userId },
    })
  }

  private convertToSlug(title: string): string {
    return title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-')
  }
}
