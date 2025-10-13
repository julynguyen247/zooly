import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  ParseBoolPipe,
} from '@nestjs/common';
import { GatewayService } from './gateway.service';

type Part = 'listening' | 'reading';

@Controller('attempts')
export class AttemptsController {
  constructor(private readonly gw: GatewayService) {}

  @Post('start')
  async start(
    @Body()
    body: {
      userId: string;
      testSetId: string;
      allowDuplicateOngoing?: boolean;
    },
  ) {
    return this.gw.startAttempts(
      body.userId,
      body.testSetId,
      !!body.allowDuplicateOngoing,
    );
  }

  @Get(':id')
  getById(
    @Param('id') id: string,
    @Query('withAnswers', new ParseBoolPipe({ optional: true }))
    withAnswers?: boolean,
  ) {
    return this.gw.getAttempt(id, !!withAnswers);
  }

  @Get('user/:userId')
  listByUser(
    @Param('userId') userId: string,
    @Query('testSetId') testSetId?: string,
  ) {
    return this.gw.listAttemptsByUser(userId, testSetId);
  }

  @Post(':id/answers')
  upsertAnswer(
    @Param('id') attemptId: string,
    @Body()
    body: {
      questionId: string;
      choiceId?: string | null;
      userAnswer?: string | null;
      part?: Part;
    },
  ) {
    if (!body?.questionId) throw new Error('Missing questionId');
    return this.gw.upsertAnswer({
      attemptId,
      questionId: body.questionId,
      choiceId: body.choiceId ?? null,
      userAnswer: body.userAnswer ?? null,
      part: body.part,
    });
  }

  @Post(':id/submit')
  submit(@Param('id') attemptId: string) {
    return this.gw.submitAttempt(attemptId);
  }
}
