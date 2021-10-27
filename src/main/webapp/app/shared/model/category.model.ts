import { IQuestion } from 'app/shared/model/question.model';
import { IResultQuestion } from 'app/shared/model/result-question.model';

export interface ICategory {
  id?: number;
  text?: string;
  questions?: IQuestion[];
  resultQuestions?: IResultQuestion[];
}

export class Category implements ICategory {
  constructor(public id?: number, public text?: string, public questions?: IQuestion[], public resultQuestions?: IResultQuestion[]) {}
}
