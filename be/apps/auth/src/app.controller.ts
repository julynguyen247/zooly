import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import type { GoogleProfileDto } from './dto/google.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern('google.oauth.upsert')
  async handleGoogleUpsert(@Payload() data: GoogleProfileDto) {
    return this.appService.upsertGoogleUser(data);
  }
}
