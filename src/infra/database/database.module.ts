import { IAnswerAttachmentsRepository } from '@/domain/forum/application/repositories/answer-attachments-repository'
import { IAnswerCommentsRepository } from '@/domain/forum/application/repositories/answer-comments-repository'
import { IAnswersRepository } from '@/domain/forum/application/repositories/answers-repository'
import { IAttachmentsRepository } from '@/domain/forum/application/repositories/attachments-repository'
import { IQuestionAttachmentsRepository } from '@/domain/forum/application/repositories/question-attachments-repository'
import { IQuestionCommentsRepository } from '@/domain/forum/application/repositories/question-comments-repository'
import { IQuestionsRepository } from '@/domain/forum/application/repositories/questions-repository'
import { IStudentsRepository } from '@/domain/forum/application/repositories/students-repository'
import { Module } from '@nestjs/common'
import { PrismaService } from './prisma/prisma.service'
import { PrismaAnswerAttachmentsRepository } from './repositories/prisma-answer-attachments-repository'
import { PrismaAnswerCommentsRepository } from './repositories/prisma-answer-comments-repository'
import { PrismaAnswersRepository } from './repositories/prisma-answers-repository'
import { PrismaAttachmentsRepository } from './repositories/prisma-attachments-repository'
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
    {
      provide: IAnswerAttachmentsRepository,
      useClass: PrismaAnswerAttachmentsRepository,
    },
    {
      provide: IAnswerCommentsRepository,
      useClass: PrismaAnswerCommentsRepository,
    },
    {
      provide: IQuestionAttachmentsRepository,
      useClass: PrismaQuestionAttachmentsRepository,
    },
    {
      provide: IQuestionCommentsRepository,
      useClass: PrismaQuestionCommentsRepository,
    },
    {
      provide: IAnswersRepository,
      useClass: PrismaAnswersRepository,
    },
    {
      provide: IAttachmentsRepository,
      useClass: PrismaAttachmentsRepository,
    },
  ],
  exports: [
    PrismaService,
    IQuestionsRepository,
    IStudentsRepository,
    IAnswerAttachmentsRepository,
    IAnswerCommentsRepository,
    IQuestionAttachmentsRepository,
    IQuestionCommentsRepository,
    IAnswersRepository,
    IAttachmentsRepository,
  ],
})
export class DatabaseModule {}
