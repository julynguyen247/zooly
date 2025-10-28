import { NestFactory } from '@nestjs/core';
import { TestsetModule } from './testset.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';

async function bootstrap() {
  const rmq = await NestFactory.createMicroservice<MicroserviceOptions>(
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
  const grpc = await NestFactory.createMicroservice<MicroserviceOptions>(
    TestsetModule,
    {
      transport: Transport.GRPC,
      options: {
        package: 'testset',
        protoPath: join(process.cwd(), 'proto', 'testset.proto'),
        url: '0.0.0.0:50052',
      },
    },
  );
  await Promise.all([rmq.listen(), grpc.listen()]);
}
bootstrap();
