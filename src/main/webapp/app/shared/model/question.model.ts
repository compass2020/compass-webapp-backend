import { IAnswer } from 'app/shared/model/answer.model';
import { ICategory } from 'app/shared/model/category.model';
import { IControlpoint } from 'app/shared/model/controlpoint.model';
import { QuestionType } from 'app/shared/model/enumerations/question-type.model';
import { Difficulty } from 'app/shared/model/enumerations/difficulty.model';

export interface IQuestion {
  id?: number;
  text?: string;
  type?: QuestionType;
  difficulty?: Difficulty;
  personal?: boolean;
  answers?: IAnswer[];
  category?: ICategory;
  controlpoints?: IControlpoint[];
  alreadyAssigned?: boolean;
}

export class Question implements IQuestion {
  constructor(
    public id?: number,
    public text?: string,
    public type?: QuestionType,
    public difficulty?: Difficulty,
    public personal?: boolean,
    public answers?: IAnswer[],
    public category?: ICategory,
    public controlpoints?: IControlpoint[],
    public alreadyAssigned?: boolean
  ) {
    this.personal = this.personal || false;
  }
}
