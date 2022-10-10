import { IQuestionAnswer, ISubmittableItem } from '../types/interfaces';

export function nbAnsweredQuestions(questions: IQuestionAnswer[]): number {
  let nbAnswered = 0;
  questions.forEach((x) => {
    if (x.answer) {
    ++nbAnswered;
    }
  });
  return nbAnswered;
}

export function nbSubmitted(submittables: ISubmittableItem[]): number {
  let nbSubmitted = 0;
  submittables.forEach((x) => {
    if (x.submitted) {
      ++nbSubmitted;
    }
  });
  return nbSubmitted;
}
