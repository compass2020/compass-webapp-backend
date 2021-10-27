import { Moment } from 'moment';
import { ISharedCourse } from 'app/shared/model/shared-course.model';

export interface ISharedCourseQrCode {
  id?: number;
  device?: string;
  qrCode?: string;
  scanned?: boolean;
  timeStampScanned?: Moment;
  sharedCourse?: ISharedCourse;
}

export class SharedCourseQrCode implements ISharedCourseQrCode {
  constructor(
    public id?: number,
    public device?: string,
    public qrCode?: string,
    public scanned?: boolean,
    public timeStampScanned?: Moment,
    public sharedCourse?: ISharedCourse
  ) {
    this.scanned = this.scanned || false;
  }
}
