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

  async upsertGoogleUser(dto: GoogleProfileDto) {
    const googleId = dto.providerId;
    const email = dto.email ? dto.email.toLowerCase() : null;
    const displayName = dto.name ?? null;
    const avatarUrl = dto.picture ?? null;
    if (!googleId) {
      throw new Error('Missing Google providerId (sub).');
    }

    let user = await this.usersRepository.findOne({ where: { googleId } });

    if (!user && email) {
      user = await this.usersRepository.findOne({ where: { email } });
      if (user && !user.googleId) {
        user.googleId = googleId;
      }
    }
    if (!user) {
      user = this.usersRepository.create({
        googleId,
        email,
        displayName,
        avatarUrl,
        isActive: true,
      });
    } else {
      if (!user.googleId) user.googleId = googleId;
      if (!user.email && email) user.email = email;
      if (displayName && displayName !== user.displayName)
        user.displayName = displayName;
      if (avatarUrl && avatarUrl !== user.avatarUrl) user.avatarUrl = avatarUrl;
      if (user.isActive === null || user.isActive === undefined)
        user.isActive = true;
    }
    const saved = await this.usersRepository.save(user);
    const payload = { sub: saved.id, email: saved.email, provider: 'google' };
    const accessToken = await this.jwtService.signAsync(payload);
    return {
      user: {
        id: saved.id,
        email: saved.email,
        name: saved.displayName,
        avatarUrl: saved.avatarUrl,
      },
      accessToken,
    };
  }
}
