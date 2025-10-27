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
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class GatewayService {
  constructor(
    @Inject('AUTH_CLIENT') private readonly authClient: ClientProxy,
    @Inject('TEST_CLIENT') private readonly testClient: ClientProxy,
    @Inject('ATTEMPTS_CLIENT') private readonly attemptsClient: ClientProxy,
    private readonly supabase: SupabaseService,
  ) {}

  async googleLogin(profile: any) {
    const payload = {
      provider: 'google',
      email: profile.email,
      username: profile.firstName,
      picture: profile.picture,
    };
    console.log('HiHi');
    return await firstValueFrom(
      this.authClient.send('google.oauth.upsert', payload),
    );
  }

  private async uploadAllFiles(files?: Express.Multer.File[]) {
    const map: { image: string | null; audio: string | null } = {
      image: null,
      audio: null,
    };
    for (const f of files || []) {
      if (f.mimetype.startsWith('image/')) {
        const { url } = await this.supabase.uploadImage(f);
        map.image = url;
      } else if (f.mimetype.startsWith('audio/')) {
        const { url } = await this.supabase.uploadAudio(f);
        map.audio = url;
      } else {
        continue;
      }
    }
    return map;
  }

  async importTest(json: any, files?: Express.Multer.File[]) {
    const fileMap = await this.uploadAllFiles(files);
    const payload: any = { json, fileMap };

    return await firstValueFrom(
      this.testClient.send('testsets.import', payload),
    );
  }
  async getTestById(id: string) {
    return await firstValueFrom(
      this.testClient.send('testsets.getById', { id }),
    );
  }
  async getAllTests() {
    const payload = {};
    return await firstValueFrom(
      this.testClient.send('testsets.getAll', payload),
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
    console.log('send message');

    return await firstValueFrom(
      this.attemptsClient.send('attempts.start', payload),
    );
  }
  async getAttempt(attemptId: string, withAnswers = false) {
    const payload: GetAttemptDto = { attemptId, withAnswers };
    return await firstValueFrom(
      this.attemptsClient.send('attempts.get', payload),
    );
  }
  async listAttemptsByUser(userId: string, testSetId?: string) {
    const payload: ListAttemptsByUserDto = { userId, testSetId };
    return await firstValueFrom(
      this.attemptsClient.send('attempts.listByUser', payload),
    );
  }
  async upsertAnswer(payload: UpsertAnswerDto) {
    return await firstValueFrom(
      this.attemptsClient.send('attempts.upsertAnswer', payload),
    );
  }
  async submitAttempt(attemptId: string) {
    const payload: SubmitAttemptDto = { attemptId };
    return await firstValueFrom(
      this.attemptsClient.send('attempts.submit', payload),
    );
  }
}
