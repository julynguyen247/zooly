import { Controller, Get } from '@nestjs/common';
import { TestsetService } from './testset.service';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller()
export class TestsetController {
  constructor(private readonly testsetService: TestsetService) {}

  @MessagePattern('testsets.import')
  importTest(@Payload() json: any) {
    return this.testsetService.importTestJson(json);
  }
  @MessagePattern('testsets.getById')
  getById(@Payload() data: { id: string }) {
    return this.testsetService.getTestById(data.id);
  }
}
