import { NestFactory } from '@nestjs/core';
import { CoursesModule } from './courses.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    CoursesModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: [process.env.RABBITMQ_URL ?? 'amqp://guest:guest@localhost:5672'],
        queue: process.env.COURSES_QUEUE ?? 'courses_queue',
        queueOptions: {
          durable: false,
        },
      },
    },
  );
}
bootstrap();
