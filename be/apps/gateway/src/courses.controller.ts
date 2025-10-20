import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { GatewayService } from './gateway.service';
import { Public } from './decorators/public.decorator';

@Controller('courses')
export class CoursesController {
  constructor(private readonly gw: GatewayService) {}
}
