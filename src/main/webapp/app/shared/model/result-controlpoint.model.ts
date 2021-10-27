import { Moment } from 'moment';
import { IResultQuestion } from 'app/shared/model/result-question.model';
import { IResultCourse } from 'app/shared/model/result-course.model';

export interface IResultControlpoint {
  id?: number;
  sequence?: number;
  timeReached?: Moment;
  latitude?: number;
  longitude?: number;
  skipAllowed?: boolean;
  reached?: boolean;
  borgScale?: number;
  forceSkipped?: boolean;
  resultQuestions?: IResultQuestion[];
  resultCourse?: IResultCourse;
}

export class ResultControlpoint implements IResultControlpoint {
  constructor(
    public id?: number,
    public sequence?: number,
    public timeReached?: Moment,
    public latitude?: number,
    public longitude?: number,
    public skipAllowed?: boolean,
    public reached?: boolean,
    public borgScale?: number,
    public forceSkipped?: boolean,
    public resultQuestions?: IResultQuestion[],
    public resultCourse?: IResultCourse
  ) {
    this.skipAllowed = this.skipAllowed || false;
    this.reached = this.reached || false;
    this.forceSkipped = this.forceSkipped || false;
  }
}
