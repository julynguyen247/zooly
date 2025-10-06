import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern('auth.register')
  async register(@Payload() data: { username: string; password: string }) {
    return this.appService.register(data.username, data.password);
  }
  @MessagePattern('auth.login')
  async login(@Payload() data: { username: string; password: string }) {
    return this.appService.login(data.username, data.password);
  }
}
