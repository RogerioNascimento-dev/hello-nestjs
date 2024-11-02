import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { Controller, Get, Query, UseGuards } from '@nestjs/common'
import {
  PageQueryParams,
  pageQueryParamsPipe,
} from './validators/fetch-recent-questions-request.validator'

@Controller('/questions')
@UseGuards(JwtAuthGuard)
export class FetchRecentQuestionsController {
  constructor(private prisma: PrismaService) {}
  @Get()
  async handler(@Query('page', pageQueryParamsPipe) page: PageQueryParams) {
    const perPage = 10
    const questions = await this.prisma.question.findMany({
      take: perPage,
      skip: (page - 1) * perPage,
      orderBy: { createdAt: 'desc' },
    })

    return { questions }
  }
}
