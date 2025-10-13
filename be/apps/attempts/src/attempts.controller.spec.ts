import { Test, TestingModule } from '@nestjs/testing';
import { AttemptsController } from './attempts.controller';
import { AttemptsService } from './attempts.service';

describe('AttemptsController', () => {
  let attemptsController: AttemptsController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AttemptsController],
      providers: [AttemptsService],
    }).compile();

    attemptsController = app.get<AttemptsController>(AttemptsController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(attemptsController.getHello()).toBe('Hello World!');
    });
  });
});
