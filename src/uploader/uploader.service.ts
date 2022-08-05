import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BlobService } from '@czarpoliedros/blob';
import { Image, ImageDocument } from './entities/image.schema';

@Injectable()
export class UploaderService {
  constructor(
    private readonly blobService: BlobService,
    @InjectModel(Image.name) private imageModel: Model<ImageDocument>,
  ) {}

  async saveImage(
    name: string,
    description: string,
    file: Express.Multer.File,
  ) {
    const imageDto = {
      name,
      description,
    };
    const imageDoc = new this.imageModel(imageDto);
    await imageDoc.save();

    const fileFormat = file.originalname.match(/\.(.*)/)[1];

    this.blobService.uploadBufferFile(imageDoc.id, fileFormat, file.buffer);

    return imageDoc.id;
  }
}
