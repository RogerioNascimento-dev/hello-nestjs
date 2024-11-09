import { InMemoryAttachmentsRepository } from 'test/repositories/in-memory-attachments-repository'
import { FakeUploader } from 'test/storage/fake-uploader'
import { InvalidAttachmentTypeError } from './errors/invalid-attachment-type-error'
import { UploadAndCreateAttachmentUseCase } from './upload-and-create-attachment'

let attachmentsRepository: InMemoryAttachmentsRepository
let sut: UploadAndCreateAttachmentUseCase
let fakeUploader: FakeUploader
describe('Upload and Create Attachment', async () => {
  beforeEach(() => {
    attachmentsRepository = new InMemoryAttachmentsRepository()
    fakeUploader = new FakeUploader()
    sut = new UploadAndCreateAttachmentUseCase(
      attachmentsRepository,
      fakeUploader,
    )
  })

  it('should be able upload and create attachment', async () => {
    const result = await sut.execute({
      fileName: 'file_name_teste.jpg',
      fileType: 'image/jpeg',
      body: Buffer.from('file content'),
    })
    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      attachment: attachmentsRepository.items[0],
    })
    expect(fakeUploader.uploads).toHaveLength(1)
    expect(fakeUploader.uploads[0]).toEqual(
      expect.objectContaining({
        fileName: 'file_name_teste.jpg',
      }),
    )
  })

  it('should not be able to upload with invalid file type', async () => {
    const result = await sut.execute({
      fileName: 'file_name_teste.mp3',
      fileType: 'audio/mpeg',
      body: Buffer.from('file content'),
    })
    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(InvalidAttachmentTypeError)
  })
})
