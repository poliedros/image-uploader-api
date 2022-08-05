import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { BlobModule } from '@czarpoliedros/blob';
import { Image, ImageSchema } from './entities/image.schema';
import { UploaderController } from './uploader.controller';
import { UploaderService } from './uploader.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    BlobModule.forRoot({
      connectionString: process.env.BLOB_CONNECTION_STRING,
    }),
    MongooseModule.forRoot(process.env.MONGO_CONNECTION_STRING),
    MongooseModule.forFeature([{ name: Image.name, schema: ImageSchema }]),
  ],
  controllers: [UploaderController],
  providers: [UploaderService],
})
export class UploaderModule {}
