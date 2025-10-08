import { NestFactory } from '@nestjs/core';
import { TestsetModule } from './testset.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    TestsetModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: [process.env.RABBITMQ_URL ?? 'amqp://guest:guest@localhost:5672'],
        queue: process.env.TEST_QUEUE ?? 'test_queue',
        queueOptions: {
          durable: false,
        },
      },
    },
  );
  await app.listen();
}
bootstrap();
