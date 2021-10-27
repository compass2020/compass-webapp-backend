import { Moment } from 'moment';
import { IResultCourse } from 'app/shared/model/result-course.model';
import { ISharedCourseQrCode } from 'app/shared/model/shared-course-qr-code.model';
import { ICourse } from 'app/shared/model/course.model';
import { GameModus } from 'app/shared/model/enumerations/game-modus.model';

export interface ISharedCourse {
  id?: number;
  name?: string;
  qrCode?: string;
  gameModus?: GameModus;
  timeStampShared?: Moment;
  visible?: boolean;
  timeStampStart?: Moment;
  timeStampEnd?: Moment;
  numberOfCustomQrCodes?: number;
  showCourseBeforeStart?: boolean;
  showPositionAllowed?: boolean;
  resultCourses?: IResultCourse[];
  sharedCourseQrCodes?: ISharedCourseQrCode[];
  course?: ICourse;
}

export class SharedCourse implements ISharedCourse {
  constructor(
    public id?: number,
    public name?: string,
    public qrCode?: string,
    public gameModus?: GameModus,
    public timeStampShared?: Moment,
    public visible?: boolean,
    public timeStampStart?: Moment,
    public timeStampEnd?: Moment,
    public numberOfCustomQrCodes?: number,
    public showCourseBeforeStart?: boolean,
    public showPositionAllowed?: boolean,
    public resultCourses?: IResultCourse[],
    public sharedCourseQrCodes?: ISharedCourseQrCode[],
    public course?: ICourse
  ) {
    this.visible = this.visible || false;
    this.showCourseBeforeStart = this.showCourseBeforeStart || false;
    this.showPositionAllowed = this.showPositionAllowed || false;
  }
}
