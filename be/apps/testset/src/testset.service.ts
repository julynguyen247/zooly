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
}
