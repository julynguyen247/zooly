import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user/user.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import type { GoogleProfileDto } from './dto/google.dto';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async upsertGoogleUser(data: GoogleProfileDto) {
    const email = data.email;
    const displayName = data.username;
    const avatarUrl = data.picture;

    let user = await this.usersRepository.findOne({ where: { email } });
    if (!user) {
      user = this.usersRepository.create({
        email,
        displayName,
        avatarUrl,
      });
      await this.usersRepository.save(user);
    }
    const payload = {
      sub: user.id,
      email: user.email,
      name: user.displayName,
    };
    const accessToken = this.jwtService.sign(payload, {
      expiresIn: '12h',
    });
    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.displayName,
        avatarUrl: user.avatarUrl,
      },
      accessToken,
    };
  }
}
