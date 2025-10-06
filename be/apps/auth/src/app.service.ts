import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
@Injectable()
export class AppService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}
  async register(username: string, password: string) {
    const hashed = await bcrypt.hash(password, 10);
    const user = this.usersRepository.create({ username, password: hashed });
    await this.usersRepository.save(user);
    return { ok: true, message: 'User registered', user: username };
  }
  async login(username: string, password: string) {
    const user = await this.usersRepository.findOne({
      where: { username },
    });
    if (!user) {
      return { ok: false, message: 'User not found' };
    }

    const match = await bcrypt.compare(password, user?.password);
    if (!match) {
      return { ok: false, message: 'Invalid credentials' };
    }
    const payload = { sub: user?.id, username: user?.username };
    const access_token = await this.jwtService.signAsync(payload);
    return {
      ok: true,
      access_token,
      user: { id: user.id, username: user.username },
    };
  }
}
