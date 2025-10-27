import {
  Controller,
  Post,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { MediaService } from './media.service';
import { memoryStorage } from 'multer';

@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Post('upload')
  @UseInterceptors(
    FilesInterceptor('files', 50, {
      storage: memoryStorage(),
    }),
  )
  uploadImage(@UploadedFiles() files: Express.Multer.File[]) {
    return this.mediaService.uploadImages(files);
  }
}
