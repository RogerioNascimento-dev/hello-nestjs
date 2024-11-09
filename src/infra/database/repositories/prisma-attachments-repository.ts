import { IAttachmentsRepository } from '@/domain/forum/application/repositories/attachments-repository'
import { Attachment } from '@/domain/forum/enterprise/entities/attachment'
import { Injectable } from '@nestjs/common'
import { PrismaAttachmentMapper } from '../mappers/prisma-attachment-mapper'
import { PrismaService } from '../prisma/prisma.service'

@Injectable()
export class PrismaAttachmentsRepository implements IAttachmentsRepository {
  constructor(private prisma: PrismaService) {}
  async create(attachment: Attachment): Promise<void> {
    await this.prisma.attachment.create({
      data: PrismaAttachmentMapper.toPrisma(attachment),
    })
  }
}
