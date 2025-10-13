import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import { TestSet } from './entities/testset.entity';
import { Passage } from './entities/passage.entity';
import { Question } from './entities/question.entity';
import { Choice } from './entities/choice.entity';

@Injectable()
export class TestsetService {
  constructor(
    @InjectRepository(TestSet) private testsets: Repository<TestSet>,
    @InjectRepository(Passage) private passages: Repository<Passage>,
    @InjectRepository(Question) private questions: Repository<Question>,
    @InjectRepository(Choice) private choices: Repository<Choice>,
  ) {}
  private partFromPartNo(partNo: number) {
    return partNo >= 1 && partNo <= 4 ? 'listening' : 'reading';
  }
  async importTestJson(json: any) {
    const testSet = await this.testsets.save(
      this.testsets.create({
        code: json.code,
        title: json.title,
        durationSeconds: json.durationSeconds ?? 7200,
      }),
    );
    for (const part of json.parts) {
      const partNo = part.partNo;
      if (part.items) {
        for (const item of part.items) {
          const q = this.questions.create({
            testSet,
            partNo,
            number: item.number,
            stem: item.stem,
            imageKey: item.imageKey,
            audioKey: item.audioKey,
            correct: item.correct,
            explanation: item.explanation,
            choices: (item.choices || []).map((c) => this.choices.create(c)),
          });
          await this.questions.save(q);
        }
      }
      if (part.groups) {
        for (const group of part.groups) {
          const passage = await this.passages.save(
            this.passages.create({
              testSet,
              partNo,
              script: group.passage?.transcriptHtml,
              audioKey: group.audioKey,
            }),
          );
          for (const q of group.questions) {
            const question = this.questions.create({
              testSet,
              passage,
              partNo,
              number: q.number,
              stem: q.stem,
              correct: q.correct,
              explanation: q.explanation,
              choices: (q.choices || []).map((c) => this.choices.create(c)),
            });
            await this.questions.save(question);
          }
        }
      }
    }
    return { testSetId: testSet.id };
  }
  async getTestById(id: string) {
    const testSet = await this.testsets.findOne({ where: { id } });
    if (!testSet) throw new NotFoundException();
    const questions = await this.questions.find({
      where: { testSet: { id } },
      relations: ['choices', 'passage'],
    });
    return {
      id: testSet.id,
      title: testSet.title,
      durationSeconds: testSet.durationSeconds,
      questions: questions.map((q) => ({
        id: q.id,
        number: q.number,
        partNo: q.partNo,
        stem: q.stem,
        imageKey: q.imageKey,
        audioKey: q.audioKey,
        passageScript: q.passage?.script,
        choices: q.choices.map((c) => ({
          label: c.label,
          text: c.text,
          audioKey: c.audioKey,
        })),
      })),
    };
  }
  async checkUserAnswer({
    questionId,
    choiceId,
    userAnswer,
  }: {
    questionId: string;
    choiceId?: string | null;
    userAnswer?: string | null;
  }) {
    const question = await this.questions.findOne({
      where: { id: questionId },
      relations: ['choices'],
    });
    let pickedLabel: 'A' | 'B' | 'C' | 'D' | undefined;
    if (!question) return { correct: false };
    if (choiceId) {
      const ch = question.choices?.find((c) => c.id === choiceId);
      pickedLabel = ch?.label as any;
    } else if (userAnswer) {
      pickedLabel = userAnswer.trim().toUpperCase() as any;
    }
    const correct = pickedLabel === question.correct;
    const part = this.partFromPartNo(question.partNo);
    return { correct, part };
  }
}
