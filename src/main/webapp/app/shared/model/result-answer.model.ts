import { IResultQuestion } from 'app/shared/model/result-question.model';

export interface IResultAnswer {
  id?: number;
  text?: string;
  correct?: boolean;
  answeredCorrectly?: boolean;
  resultQuestion?: IResultQuestion;
}

export class ResultAnswer implements IResultAnswer {
  constructor(
    public id?: number,
    public text?: string,
    public correct?: boolean,
    public answeredCorrectly?: boolean,
    public resultQuestion?: IResultQuestion
  ) {
    this.correct = this.correct || false;
    this.answeredCorrectly = this.answeredCorrectly || false;
  }
}
