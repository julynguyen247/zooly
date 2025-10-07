import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class GatewayService {
  constructor(
    @Inject('AUTH_CLIENT') private readonly authClient: ClientProxy,
  ) {}

  async login(payload: { username: string; password: string }) {
    return await firstValueFrom(this.authClient.send('auth.login', payload));
  }
  async register(payload: { username: string; password: string }) {
    return await firstValueFrom(this.authClient.send('auth.register', payload));
  }
}
