import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { GatewayService } from './gateway.service';
import { Public } from './decorators/public.decorator';

@Controller('testsets')
export class TestsetController {
  constructor(private readonly gw: GatewayService) {}

  @Public()
  @Post('import')
  import(@Body() json: any) {
    return this.gw.importTest(json);
  }

  @Get(':id')
  getById(@Param('id') id: string) {
    return this.gw.getTestById(id);
  }
}
