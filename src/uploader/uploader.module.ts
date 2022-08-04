import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BlobModule } from '@czarpoliedros/blob';
import { Image, ImageSchema } from './entities/image.schema';
import { UploaderController } from './uploader.controller';

@Module({
  imports: [
    BlobModule.forRoot({
      connectionString: process.env.BLOB_CONNECTION_STRING,
    }),
    MongooseModule.forRoot(process.env.MONGO_CONNECTION_STRING),
    MongooseModule.forFeature([{ name: Image.name, schema: ImageSchema }]),
  ],
  controllers: [UploaderController],
})
export class UploaderModule {}
