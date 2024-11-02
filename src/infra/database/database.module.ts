import { IQuestionsRepository } from '@/domain/forum/application/repositories/questions-repository'
import { Module } from '@nestjs/common'
import { PrismaService } from './prisma/prisma.service'
import { PrismaAnswerAttachmentsRepository } from './repositories/prisma-answer-attachments-repository'
import { PrismaAnswerCommentsRepository } from './repositories/prisma-answer-comments-repository'
import { PrismaAnswersRepository } from './repositories/prisma-answers-repository'
import { PrismaQuestionAttachmentsRepository } from './repositories/prisma-question-attachments-repository'
import { PrismaQuestionCommentsRepository } from './repositories/prisma-question-comments-repository'
import { PrismaQuestionsRepository } from './repositories/prisma-questions-repository'

@Module({
  providers: [
    PrismaService,
    {
      provide: IQuestionsRepository,
      useClass: PrismaQuestionsRepository,
    },
    PrismaAnswerAttachmentsRepository,
    PrismaAnswerCommentsRepository,
    PrismaQuestionAttachmentsRepository,
    PrismaQuestionCommentsRepository,
    PrismaAnswersRepository,
  ],
  exports: [
    PrismaService,
    IQuestionsRepository,
    PrismaAnswerAttachmentsRepository,
    PrismaAnswerCommentsRepository,
    PrismaQuestionAttachmentsRepository,
    PrismaQuestionCommentsRepository,
    PrismaAnswersRepository,
  ],
})
export class DatabaseModule {}
