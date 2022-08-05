import { Test, TestingModule } from '@nestjs/testing';
import { BlobService } from '@czarpoliedros/blob';
import { UploaderService } from './uploader.service';
import { PassThrough } from 'stream';
import { getModelToken } from '@nestjs/mongoose';
import { Image } from './entities/image.schema';

describe('UploaderService', () => {
  let service: UploaderService;
  const mockImageModel = jest.fn();

  beforeEach(async () => {
    jest.resetAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UploaderService,
        {
          provide: BlobService,
          useValue: {
            uploadBufferFile: jest.fn(),
          },
        },
        {
          provide: getModelToken(Image.name),
          useValue: mockImageModel,
        },
      ],
    }).compile();

    service = module.get<UploaderService>(UploaderService);
  });

  it('should save image', async () => {
    mockImageModel.mockReturnValue({ save: jest.fn(), id: '123' });

    const file: Express.Multer.File = {
      fieldname: 'image.jpg',
      filename: 'image.jpg',
      size: 12,
      originalname: 'image.jpg',
      encoding: '',
      mimetype: '',
      buffer: new Buffer('23, 32'),
      destination: '',
      path: '',
      stream: new PassThrough(),
    };

    const response = await service.saveImage(
      'image',
      'a good description',
      file,
    );

    expect(response).toEqual('123');
  });
});
