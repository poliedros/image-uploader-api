import { UploaderService } from './uploader.service';
import { Test, TestingModule } from '@nestjs/testing';
import { UploaderController } from './uploader.controller';

describe('UploaderController', () => {
  let controller: UploaderController;
  const saveImageMock = jest.fn();

  beforeEach(async () => {
    jest.resetAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UploaderController],
      providers: [
        {
          provide: UploaderService,
          useValue: { saveImage: saveImageMock },
        },
      ],
    }).compile();

    controller = module.get<UploaderController>(UploaderController);
  });

  it('should save image with its metadata', async () => {
    const expectedValue = '123';
    saveImageMock.mockReturnValue(Promise.resolve(expectedValue));
    const file: Express.Multer.File = {
      fieldname: 'image.jpg',
      filename: 'image.jpg',
      size: 12,
      originalname: 'image.jpg',
      encoding: '',
      mimetype: '',
      buffer: null,
      destination: '',
      path: '',
      stream: null,
    };

    const response = await controller.uploadImage(
      { name: 'file.jpg', description: 'a good image' },
      file,
    );

    expect(response).toEqual({ id: expectedValue });
  });
});
