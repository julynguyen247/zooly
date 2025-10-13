import { NestFactory } from '@nestjs/core';
import { AttemptsModule } from './attempts.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AttemptsModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: [process.env.RABBITMQ_URL ?? 'amqp://guest:guest@localhost:5672'],
        queue: process.env.ATTEMPTS_QUEUE ?? 'attempts_queue',
        queueOptions: {
          durable: false,
        },
      },
    },
  );
}
bootstrap();
