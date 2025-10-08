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
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: '123456',
      database: 'testset_service',
      entities: [TestSet, Passage, Question, Choice],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([TestSet, Passage, Question, Choice]),
  ],
  controllers: [TestsetController],
  providers: [TestsetService],
})
export class TestsetModule {}
