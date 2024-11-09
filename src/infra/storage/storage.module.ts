import { IUploader } from '@/domain/forum/application/storage/uploader'
import { Module } from '@nestjs/common'
import { EnvModule } from '../env/env.module'
import { R2Storage } from './r2-storage'

@Module({
  imports: [EnvModule],
  providers: [{ provide: IUploader, useClass: R2Storage }],
  exports: [IUploader],
})
export class StorageModule {}
