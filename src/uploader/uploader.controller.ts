import { UploaderService } from './uploader.service';
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

const TWO_MBs = 2097152;

type UploadDto = {
  name: string;
  description: string;
};

@Controller()
export class UploaderController {
  constructor(private readonly uploaderService: UploaderService) {}

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
    const id = await this.uploaderService.saveImage(
      dto.name,
      dto.description,
      file,
    );

    return {
      id,
    };
  }
}
