import { Module } from '@nestjs/common';
import { AttemptsController } from './attempts.controller';
import { AttemptsService } from './attempts.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Answer } from './entities/answer.entity';
import { Attempt } from './entities/attempt.entity';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['apps/attempts/.env'],
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: +process.env.DB_PORT!,
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      entities: [Attempt, Answer],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([Attempt, Answer]),
    ClientsModule.registerAsync([
      {
        name: 'TEST_CLIENT',
        useFactory: () => ({
          transport: Transport.RMQ,
          options: {
            urls: [
              process.env.RABBITMQ_URL || 'amqp://guest:guest@localhost:5672',
            ],
            queue: process.env.TEST_QUEUE || 'test_queue',
            queueOptions: {
              durable: false,
            },
          },
        }),
      },
    ]),
    ClientsModule.register([
      {
        name: 'TESTSET_PACKAGE',
        transport: Transport.GRPC,
        options: {
          package: 'testset',
          protoPath: join(process.cwd(), 'proto', 'testset.proto'),
          url: process.env.TESTSET_SVC_URL || 'testset-svc:50052',
        },
      },
    ]),
  ],
  controllers: [AttemptsController],
  providers: [AttemptsService],
})
export class AttemptsModule {}
