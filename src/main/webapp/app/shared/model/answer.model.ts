import { IQuestion } from 'app/shared/model/question.model';

export interface IAnswer {
  id?: number;
  text?: string;
  correct?: boolean;
  question?: IQuestion;
}

export class Answer implements IAnswer {
  constructor(public id?: number, public text?: string, public correct?: boolean, public question?: IQuestion) {
    this.correct = this.correct || false;
  }
}
