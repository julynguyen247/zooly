import { Body, Controller, Get, Post } from '@nestjs/common';
import { GatewayService } from './gateway.service';

@Controller('auth')
export class GatewayController {
  constructor(private readonly gatewayService: GatewayService) {}
  @Post('login')
  async login(@Body() body: { username: string; password: string }) {
    return this.gatewayService.login(body);
  }
  @Post('register')
  async register(@Body() body: { username: string; password: string }) {
    return this.gatewayService.register(body);
  }
}
