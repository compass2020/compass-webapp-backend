import { IOrienteeringMap } from 'app/shared/model/orienteering-map.model';
import { IControlpoint } from 'app/shared/model/controlpoint.model';
import { ISharedCourse } from 'app/shared/model/shared-course.model';

export interface ICourse {
  id?: number;
  name?: string;
  shared?: boolean;
  mapFinalSmallContentType?: string;
  mapFinalSmall?: any;
  location?: string;
  altitudeUp?: number;
  altitudeDown?: number;
  length?: number;
  orienteeringMap?: IOrienteeringMap;
  controlpoints?: IControlpoint[];
  sharedCourses?: ISharedCourse[];
}

export class Course implements ICourse {
  constructor(
    public id?: number,
    public name?: string,
    public shared?: boolean,
    public mapFinalSmallContentType?: string,
    public mapFinalSmall?: any,
    public location?: string,
    public altitudeUp?: number,
    public altitudeDown?: number,
    public length?: number,
    public orienteeringMap?: IOrienteeringMap,
    public controlpoints?: IControlpoint[],
    public sharedCourses?: ISharedCourse[]
  ) {
    this.shared = this.shared || false;
  }
}
