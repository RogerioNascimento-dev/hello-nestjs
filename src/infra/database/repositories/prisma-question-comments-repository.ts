import { PaginateParams } from '@/core/repositories/paginate-params'
import { IQuestionCommentsRepository } from '@/domain/forum/application/repositories/question-comments-repository'
import { QuestionComment } from '@/domain/forum/enterprise/entities/question-comment'
import { CommentWithAuthor } from '@/domain/forum/enterprise/entities/value-objects/comment-with-author'
import { Injectable } from '@nestjs/common'
import { PrismaCommentWithAuthorMapper } from '../mappers/prisma-comment-with-author-mapper'
import { PrismaQuestionCommentMapper } from '../mappers/prisma-question-comment-mapper'
import { PrismaService } from '../prisma/prisma.service'

@Injectable()
export class PrismaQuestionCommentsRepository
  implements IQuestionCommentsRepository
{
  constructor(private prisma: PrismaService) {}

  async findById(id: string): Promise<QuestionComment | null> {
    const questionComment = await this.prisma.comment.findUnique({
      where: { id },
    })
    if (!questionComment) return null
    return PrismaQuestionCommentMapper.toDomain(questionComment)
  }

  async findManyByQuestionId(
    questionId: string,
    { page }: PaginateParams,
  ): Promise<QuestionComment[]> {
    const perPage = 20
    const questionComments = await this.prisma.comment.findMany({
      where: { questionId },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * perPage,
      take: perPage,
    })

    return questionComments.map(PrismaQuestionCommentMapper.toDomain)
  }

  async findManyByQuestionIdWithAuthor(
    questionId: string,
    { page }: PaginateParams,
  ): Promise<CommentWithAuthor[]> {
    const perPage = 20
    const questionComments = await this.prisma.comment.findMany({
      where: { questionId },
      include: { author: true },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * perPage,
      take: perPage,
    })

    return questionComments.map(PrismaCommentWithAuthorMapper.toDomain)
  }

  async create(questionComment: QuestionComment): Promise<void> {
    const data = PrismaQuestionCommentMapper.toPrisma(questionComment)
    await this.prisma.comment.create({ data })
  }

  async delete(questionComment: QuestionComment): Promise<void> {
    await this.prisma.comment.delete({
      where: { id: questionComment.id.toString() },
    })
  }
}
