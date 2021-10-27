import { IResultAnswer } from 'app/shared/model/result-answer.model';
import { ICategory } from 'app/shared/model/category.model';
import { IResultControlpoint } from 'app/shared/model/result-controlpoint.model';
import { QuestionType } from 'app/shared/model/enumerations/question-type.model';
import { Difficulty } from 'app/shared/model/enumerations/difficulty.model';

export interface IResultQuestion {
  id?: number;
  text?: string;
  type?: QuestionType;
  difficulty?: Difficulty;
  answeredCorrectly?: boolean;
  resultAnswers?: IResultAnswer[];
  category?: ICategory;
  resultControlpoints?: IResultControlpoint[];
}

export class ResultQuestion implements IResultQuestion {
  constructor(
    public id?: number,
    public text?: string,
    public type?: QuestionType,
    public difficulty?: Difficulty,
    public answeredCorrectly?: boolean,
    public resultAnswers?: IResultAnswer[],
    public category?: ICategory,
    public resultControlpoints?: IResultControlpoint[]
  ) {
    this.answeredCorrectly = this.answeredCorrectly || false;
  }
}
