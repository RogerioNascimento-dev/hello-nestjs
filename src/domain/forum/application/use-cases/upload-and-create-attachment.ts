import { Either, left, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { Attachment } from '../../enterprise/entities/attachment'
import { IAttachmentsRepository } from '../repositories/attachments-repository'
import { IUploader } from '../storage/uploader'
import { InvalidAttachmentTypeError } from './errors/invalid-attachment-type-error'

interface UploadAndCreateAttachmentUseCaseRequest {
  fileName: string
  fileType: string
  body: Buffer
}
type UploadAndCreateAttachmentUseCaseResponse = Either<
  InvalidAttachmentTypeError,
  {
    attachment: Attachment
  }
>
@Injectable()
export class UploadAndCreateAttachmentUseCase {
  constructor(
    private attachmentsRepository: IAttachmentsRepository,
    private uploader: IUploader,
  ) {}

  async execute({
    fileName,
    fileType,
    body,
  }: UploadAndCreateAttachmentUseCaseRequest): Promise<UploadAndCreateAttachmentUseCaseResponse> {
    if (!this.validateMimeType(fileType)) {
      return left(new InvalidAttachmentTypeError(fileType))
    }

    // external upload
    const { url } = await this.uploader.upload({ fileName, fileType, body })

    const attachment = Attachment.create({ title: fileName, url })
    await this.attachmentsRepository.create(attachment)

    return right({ attachment })
  }

  private validateMimeType(fileType: string): boolean {
    const mimeTypePattern =
      /^(image\/png|image\/jpg|image\/jpeg|application\/pdf)$/
    return mimeTypePattern.test(fileType)
  }
}
