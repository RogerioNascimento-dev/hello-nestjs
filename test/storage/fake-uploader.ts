import {
  IUploader,
  UploadParams,
} from '@/domain/forum/application/storage/uploader'

interface Upload {
  fileName: string
  url: string
}
export class FakeUploader implements IUploader {
  public uploads: Upload[] = []
  async upload({ fileName }: UploadParams): Promise<{ url: string }> {
    const url = `http://fake-url-${fileName}.com`
    this.uploads.push({
      fileName,
      url,
    })
    return { url }
  }
}
