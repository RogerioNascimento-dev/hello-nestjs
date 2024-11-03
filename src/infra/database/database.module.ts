import { IQuestionsRepository } from '@/domain/forum/application/repositories/questions-repository'
import { IStudentsRepository } from '@/domain/forum/application/repositories/students-repository'
import { Module } from '@nestjs/common'
import { PrismaService } from './prisma/prisma.service'
import { PrismaAnswerAttachmentsRepository } from './repositories/prisma-answer-attachments-repository'
import { PrismaAnswerCommentsRepository } from './repositories/prisma-answer-comments-repository'
import { PrismaAnswersRepository } from './repositories/prisma-answers-repository'
import { PrismaQuestionAttachmentsRepository } from './repositories/prisma-question-attachments-repository'
import { PrismaQuestionCommentsRepository } from './repositories/prisma-question-comments-repository'
import { PrismaQuestionsRepository } from './repositories/prisma-questions-repository'
import { PrismaStudentsRepository } from './repositories/prisma-students-repository'

@Module({
  providers: [
    PrismaService,
    {
      provide: IQuestionsRepository,
      useClass: PrismaQuestionsRepository,
    },
    {
      provide: IStudentsRepository,
      useClass: PrismaStudentsRepository,
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
    IStudentsRepository,
    PrismaAnswerAttachmentsRepository,
    PrismaAnswerCommentsRepository,
    PrismaQuestionAttachmentsRepository,
    PrismaQuestionCommentsRepository,
    PrismaAnswersRepository,
  ],
})
export class DatabaseModule {}
