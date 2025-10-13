import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Attempt } from './entities/attempt.entity';
import { Answer, PartType } from './entities/answer.entity';
import { Repository } from 'typeorm';
import { ClientProxy } from '@nestjs/microservices';
import {
  StartAttemptDto,
  SubmitAttemptDto,
  UpsertAnswerDto,
} from './dto/attempts.dto';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AttemptsService {
  constructor(
    @InjectRepository(Attempt) private attempts: Repository<Attempt>,
    @InjectRepository(Answer) private answers: Repository<Answer>,
    @Inject('TEST_CLIENT') private testsetClient: ClientProxy,
  ) {}
  async startAttempt(dto: StartAttemptDto) {
    const ongoing = await this.attempts.findOne({
      where: {
        userId: dto.userId,
        testSetId: dto.testSetId,
        status: 'ongoing',
      },
    });
    if (ongoing && !dto.allowDuplicateOngoing) return false;
    return this.attempts.save(
      this.attempts.create({
        userId: dto.userId,
        testSetId: dto.testSetId,
        status: 'ongoing',
        createdAt: new Date(),
      }),
    );
  }
  async getAttempt(id: string, withAnswers = false) {
    const at = await this.attempts.findOne({
      where: { id },
      relations: withAnswers ? { answers: true } : {},
    });
    if (!at) throw new NotFoundException('Attempt not found');
    return at;
  }

  listByUser(userId: string, testSetId?: string) {
    return this.attempts.find({
      where: { userId, ...(testSetId ? { testSetId } : {}) },
      order: { createdAt: 'DESC' },
    });
  }
  async upsertAnswer(dto: UpsertAnswerDto) {
    const attempt = await this.getAttempt(dto.attemptId);
    if (attempt.status !== 'ongoing')
      throw new NotFoundException('Attempt not found');
    const check = await firstValueFrom(
      this.testsetClient.send('testset.checkAnswer', {
        questionId: dto.questionId,
        choiceId: dto.choiceId ?? null,
        userAnswer: dto.userAnswer ?? null,
      }),
    ).catch(() => ({ correct: false, part: dto.part }));

    const part: PartType = (check.part ?? dto.part) as PartType;
    if (!part) throw new BadRequestException('Missing part');

    let ans = await this.answers.findOne({
      where: { attemptId: dto.attemptId, questionId: dto.questionId },
    });
    if (!ans) {
      ans = await this.answers.create({
        attemptId: dto.attemptId,
        questionId: dto.questionId,
        choiceId: dto.choiceId ?? null,
        userAnswer: dto.userAnswer ?? null,
        isCorrect: !!check.correct,
        part: check.part ?? dto.part,
      });
    } else {
      ans.choiceId = dto.choiceId ?? ans.choiceId;
      ans.userAnswer = dto.userAnswer ?? ans.userAnswer;
      ans.isCorrect = !!check.correct;
      ans.part = check.part ?? dto.part ?? ans.part;
    }
    await this.answers.save(ans);
    return { answerId: ans.id, isCorrect: ans.isCorrect };
  }
  async submitAttempt(dto: SubmitAttemptDto) {
    const attempt = await this.getAttempt(dto.attemptId, true);
    if (attempt.status !== 'ongoing')
      throw new BadRequestException('Attempt is not ongoing');
    const rawListening = attempt.answers.filter(
      (a) => a.part === 'listening' && a.isCorrect,
    ).length;
    const rawReading = attempt.answers.filter(
      (a) => a.part === 'reading' && a.isCorrect,
    ).length;
    const scaledListening = this.toeicScale(rawListening);
    const scaledReading = this.toeicScale(rawReading);
    attempt.rawListening = rawListening;
    attempt.rawReading = rawReading;
    attempt.scaledListening = scaledListening;
    attempt.scaledReading = scaledReading;
    attempt.total = scaledListening + scaledReading;
    attempt.status = 'submitted';
    await this.attempts.save(attempt);
    return {
      attemptId: attempt.id,
      rawListening,
      rawReading,
      scaledListening,
      scaledReading,
      total: attempt.total,
      submittedAt: attempt.submittedAt,
    };
  }
  private toeicScale(raw: number) {
    const sMin = 5,
      sMax = 495;
    const scaled = sMin + (raw / 100) * (sMax - sMin);
    return Math.round(scaled / 5) * 5;
  }
}
