type Part = 'listening' | 'reading';
export interface StartAttemptDto {
  userId: string;
  testSetId: string;
  allowDuplicateOngoing?: boolean;
}

export interface GetAttemptDto {
  attemptId: string;
  withAnswers?: boolean;
}

export interface ListAttemptsByUserDto {
  userId: string;
  testSetId?: string;
}

export interface UpsertAnswerDto {
  attemptId: string;
  questionId: string;
  choiceId?: string | null;
  userAnswer?: string | null;
  part?: Part;
}

export interface SubmitAttemptDto {
  attemptId: string;
  userId?: string;
  reason?: 'manual' | 'timeout' | 'system';
  submittedAtClient?: string;
}
