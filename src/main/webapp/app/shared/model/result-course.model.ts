import { Moment } from 'moment';
import { IResultAdditionalInfo } from 'app/shared/model/result-additional-info.model';
import { IResultControlpoint } from 'app/shared/model/result-controlpoint.model';
import { ISharedCourse } from 'app/shared/model/shared-course.model';

export interface IResultCourse {
  id?: number;
  nickName?: string;
  timeStampFinished?: Moment;
  timeStampStarted?: Moment;
  totalDurationInMillis?: number;
  viewCode?: string;
  showPositionCounter?: number;
  switchAppCounter?: number;
  resultAdditionalinfo?: IResultAdditionalInfo;
  resultControlpoints?: IResultControlpoint[];
  sharedCourse?: ISharedCourse;
}

export class ResultCourse implements IResultCourse {
  constructor(
    public id?: number,
    public nickName?: string,
    public timeStampFinished?: Moment,
    public timeStampStarted?: Moment,
    public totalDurationInMillis?: number,
    public viewCode?: string,
    public showPositionCounter?: number,
    public switchAppCounter?: number,
    public resultAdditionalinfo?: IResultAdditionalInfo,
    public resultControlpoints?: IResultControlpoint[],
    public sharedCourse?: ISharedCourse
  ) {}
}
