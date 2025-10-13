import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import {
  GetAttemptDto,
  ListAttemptsByUserDto,
  StartAttemptDto,
  SubmitAttemptDto,
  UpsertAnswerDto,
} from 'apps/attempts/src/dto/attempts.dto';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class GatewayService {
  constructor(
    @Inject('AUTH_CLIENT') private readonly authClient: ClientProxy,
    @Inject('TEST_CLIENT') private readonly testClient: ClientProxy,
    @Inject('ATTEMPTS_CLIENT') private readonly attemptsClient: ClientProxy,
  ) {}

  async login(payload: { username: string; password: string }) {
    return await firstValueFrom(this.authClient.send('auth.login', payload));
  }
  async register(payload: { username: string; password: string }) {
    return await firstValueFrom(this.authClient.send('auth.register', payload));
  }
  async importTest(json: any) {
    return await firstValueFrom(this.testClient.send('testsets.import', json));
  }
  async getTestById(id: string) {
    return await firstValueFrom(
      this.testClient.send('testsets.getById', { id }),
    );
  }
  async startAttempts(
    userId: string,
    testSetId: string,
    allowDuplicateOngoing = false,
  ) {
    const payload: StartAttemptDto = {
      userId,
      testSetId,
      allowDuplicateOngoing,
    };
    return firstValueFrom(this.attemptsClient.send('attempts.start', payload));
  }
  async getAttempt(attemptId: string, withAnswers = false) {
    const payload: GetAttemptDto = { attemptId, withAnswers };
    return firstValueFrom(this.attemptsClient.send('attempts.get', payload));
  }
  async listAttemptsByUser(userId: string, testSetId?: string) {
    const payload: ListAttemptsByUserDto = { userId, testSetId };
    return firstValueFrom(
      this.attemptsClient.send('attempts.listByUser', payload),
    );
  }
  async upsertAnswer(payload: UpsertAnswerDto) {
    return firstValueFrom(
      this.attemptsClient.send('attempts.upsertAnswer', payload),
    );
  }
  async submitAttempt(attemptId: string) {
    const payload: SubmitAttemptDto = { attemptId };
    return firstValueFrom(this.attemptsClient.send('attempts.submit', payload));
  }
}
