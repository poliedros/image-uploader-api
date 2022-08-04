import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  ParseFilePipe,
  MaxFileSizeValidator,
  Body,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import { BlobService } from '@czarpoliedros/blob';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Image, ImageDocument } from './entities/image.schema';

const TWO_MBs = 2097152;

type UploadDto = {
  name: string;
  description: string;
};

@Controller()
export class UploaderController {
  constructor(
    private readonly blobService: BlobService,
    @InjectModel(Image.name) private imageModel: Model<ImageDocument>,
  ) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(
    @Body() dto: UploadDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [new MaxFileSizeValidator({ maxSize: TWO_MBs })],
      }),
    )
    file: Express.Multer.File,
  ) {
    // insert dto (name and description) in the collection and get the id
    const imageDoc = new this.imageModel(dto);
    await imageDoc.save();

    const fileFormat = file.originalname.match(/\.(.*)/)[1];

    // upload file
    this.blobService.uploadBufferFile(imageDoc.id, fileFormat, file.buffer);

    return {
      id: imageDoc.id,
    };
  }
}
