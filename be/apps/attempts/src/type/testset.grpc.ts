import { Observable } from 'rxjs';

export type GrpcPart = 'reading' | 'listening';

export interface CheckAnswerRequest {
  questionId: string;
  choiceId?: string | null;
  userAnswer?: string | null;
}

export interface CheckAnswerResponse {
  correct: boolean;
  part?: GrpcPart;
}

export interface TestsetServiceGrpc {
  checkAnswer(req: CheckAnswerRequest): Observable<CheckAnswerResponse>;
}
