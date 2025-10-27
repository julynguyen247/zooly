import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { GatewayService } from './gateway.service';
import { Public } from './decorators/public.decorator';
import { FilesInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';

@Controller('testsets')
export class TestsetController {
  constructor(private readonly gw: GatewayService) {}

  @Public()
  @Post('import')
  @UseInterceptors(
    FilesInterceptor('files', 50, {
      storage: memoryStorage(),
    }),
  )
  async import(
    @Body('payload') payload: string,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    console.log(
      files.map((f) => ({
        name: f.originalname,
        len: f.buffer?.length,
        mime: f.mimetype,
      })),
    );
    const json = JSON.parse(payload);
    return this.gw.importTest(json, files);
  }

  @Public()
  @Get('all')
  getAll() {
    return this.gw.getAllTests();
  }

  @Public()
  @Get(':id')
  getById(@Param('id') id: string) {
    return this.gw.getTestById(id);
  }
}
