import { Body, Controller, Get, Post } from '@nestjs/common';
import { GatewayService } from './gateway.service';
import { Public } from './decorators/public.decorator';

@Controller('auth')
export class GatewayController {
  constructor(private readonly gatewayService: GatewayService) {}
  @Public()
  @Post('login')
  async login(@Body() body: { username: string; password: string }) {
    return this.gatewayService.login(body);
  }
  @Public()
  @Post('register')
  async register(@Body() body: { username: string; password: string }) {
    return this.gatewayService.register(body);
  }
}
