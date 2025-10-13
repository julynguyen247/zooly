import { Module } from '@nestjs/common';
import { AttemptsController } from './attempts.controller';
import { AttemptsService } from './attempts.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Answer } from './entities/answer.entity';
import { Attempt } from './entities/attempt.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['apps/attempts/.env'],
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: '123456',
      database: 'attempts_service',
      entities: [Answer, Attempt],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([Answer, Attempt]),
  ],
  controllers: [AttemptsController],
  providers: [AttemptsService],
})
export class AttemptsModule {}
