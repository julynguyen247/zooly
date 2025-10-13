import { Module } from '@nestjs/common';
import { TestsetController } from './testset.controller';
import { TestsetService } from './testset.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TestSet } from './entities/testset.entity';
import { Passage } from './entities/passage.entity';
import { Question } from './entities/question.entity';
import { Choice } from './entities/choice.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['apps/testset/.env'],
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'postgres',
      port: +process.env.DB_PORT!,
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      entities: [TestSet, Passage, Question, Choice],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([TestSet, Passage, Question, Choice]),
  ],
  controllers: [TestsetController],
  providers: [TestsetService],
})
export class TestsetModule {}
