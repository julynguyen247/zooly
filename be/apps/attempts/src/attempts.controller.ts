import { Controller, Get } from '@nestjs/common';
import { AttemptsService } from './attempts.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import type {
  GetAttemptDto,
  ListAttemptsByUserDto,
  StartAttemptDto,
  SubmitAttemptDto,
  UpsertAnswerDto,
} from './dto/attempts.dto';

@Controller()
export class AttemptsController {
  constructor(private readonly attemptsService: AttemptsService) {}

  @MessagePattern('attempts.start') start(@Payload() dto: StartAttemptDto) {
    return this.attemptsService.startAttempt(dto);
  }
  @MessagePattern('attempts.get') get(@Payload() dto: GetAttemptDto) {
    return this.attemptsService.getAttempt(dto);
  }
  @MessagePattern('attempts.listByUser') list(
    @Payload() dto: ListAttemptsByUserDto,
  ) {
    return this.attemptsService.listByUser(dto.userId, dto.testSetId);
  }
  @MessagePattern('attempts.upsertAnswer') upsert(
    @Payload() dto: UpsertAnswerDto,
  ) {
    return this.attemptsService.upsertAnswer(dto);
  }
  @MessagePattern('attempts.submit') submit(@Payload() dto: SubmitAttemptDto) {
    return this.attemptsService.submitAttempt(dto);
  }
}
