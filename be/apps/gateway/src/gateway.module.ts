import { Module } from '@nestjs/common';
import { GatewayController } from './gateway.controller';
import { GatewayService } from './gateway.service';
import { ConfigModule } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from '../passport/jwt.strategy';
import { JwtAuthGuard } from '../passport/jwt-auth.guard';
import { APP_GUARD } from '@nestjs/core';
import { TestsetController } from './testset.controller';
import { AttemptsController } from './attempts.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['apps/gateway/.env'],
    }),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    ClientsModule.registerAsync([
      {
        name: 'AUTH_CLIENT',
        useFactory: () => ({
          transport: Transport.RMQ,
          options: {
            urls: [
              process.env.RABBITMQ_URL || 'amqp://guest:guest@localhost:5672',
            ],
            queue: process.env.AUTH_QUEUE || 'auth_queue',
            queueOptions: {
              durable: false,
            },
          },
        }),
      },
    ]),
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
    ClientsModule.registerAsync([
      {
        name: 'ATTEMPTS_CLIENT',
        useFactory: () => ({
          transport: Transport.RMQ,
          options: {
            urls: [
              process.env.RABBITMQ_URL || 'amqp://guest:guest@localhost:5672',
            ],
            queue: process.env.ATTEMPTS_QUEUE || 'attempts_queue',
            queueOptions: {
              durable: false,
            },
          },
        }),
      },
    ]),
  ],
  controllers: [GatewayController, TestsetController, AttemptsController],
  providers: [
    GatewayService,
    JwtStrategy,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
  exports: [PassportModule, JwtStrategy],
})
export class GatewayModule {}
