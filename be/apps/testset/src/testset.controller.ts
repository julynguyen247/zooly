import { Controller, Get } from '@nestjs/common';
import { TestsetService } from './testset.service';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller()
export class TestsetController {
  constructor(private readonly testsetService: TestsetService) {}

  @MessagePattern('testsets.import')
  async handleImport(@Payload() data: any) {
    const { json, fileMap } = data;
    return this.testsetService.importTestJson(json, fileMap);
  }
  @MessagePattern('testsets.getById')
  getById(@Payload() data: { id: string }) {
    return this.testsetService.getTestById(data.id);
  }
  @MessagePattern('testsets.checkAnswer')
  checkAnswer(
    @Payload()
    data: {
      questionId: string;
      userAnswer?: string | null;
      choiceId?: string | null;
    },
  ) {
    return this.testsetService.checkUserAnswer(data);
  }

  @MessagePattern('testsets.getAll')
  getAll() {
    return this.testsetService.getAllTests();
  }
}
