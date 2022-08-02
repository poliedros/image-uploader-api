import { Module } from '@nestjs/common';
import { UploaderModule } from './uploader/uploader.module';

@Module({
  imports: [UploaderModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
