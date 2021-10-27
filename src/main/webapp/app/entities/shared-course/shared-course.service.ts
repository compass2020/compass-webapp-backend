import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as moment from 'moment';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared/util/request-util';
import { ISharedCourse } from 'app/shared/model/shared-course.model';

type EntityResponseType = HttpResponse<ISharedCourse>;
type EntityArrayResponseType = HttpResponse<ISharedCourse[]>;

@Injectable({ providedIn: 'root' })
export class SharedCourseService {
  public resourceUrl = SERVER_API_URL + 'api/shared-courses';

  constructor(protected http: HttpClient) {}

  create(sharedCourse: ISharedCourse): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(sharedCourse);
    return this.http
      .post<ISharedCourse>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(sharedCourse: ISharedCourse): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(sharedCourse);
    return this.http
      .put<ISharedCourse>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<ISharedCourse>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<ISharedCourse[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  getMySharedCourses(): Observable<EntityArrayResponseType> {
    return this.http.get<ISharedCourse[]>(`${this.resourceUrl}/current`, { observe: 'response' });
  }

  getAllSharedCoursesForCourseId(id: number): Observable<EntityArrayResponseType> {
    return this.http.get<ISharedCourse[]>(`${this.resourceUrl}/course/${id}`, { observe: 'response' });
  }

  getQrCodesForSharedCourse(id: number): Observable<EntityResponseType> {
    return this.http
      .get<ISharedCourse>(`${this.resourceUrl}/qrcodes/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  protected convertDateFromClient(sharedCourse: ISharedCourse): ISharedCourse {
    const copy: ISharedCourse = Object.assign({}, sharedCourse, {
      timeStampShared:
        sharedCourse.timeStampShared /*  && sharedCourse.timeStampShared.isValid() ? sharedCourse.timeStampShared.toJSON() : undefined, */,
      timeStampStart:
        sharedCourse.timeStampStart && sharedCourse.timeStampStart.isValid() ? sharedCourse.timeStampStart.toJSON() : undefined,
      timeStampEnd: sharedCourse.timeStampEnd && sharedCourse.timeStampEnd.isValid() ? sharedCourse.timeStampEnd.toJSON() : undefined,
    });
    return copy;
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.timeStampShared = res.body.timeStampShared ? moment(res.body.timeStampShared) : undefined;
      res.body.timeStampStart = res.body.timeStampStart ? moment(res.body.timeStampStart) : undefined;
      res.body.timeStampEnd = res.body.timeStampEnd ? moment(res.body.timeStampEnd) : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((sharedCourse: ISharedCourse) => {
        sharedCourse.timeStampShared = sharedCourse.timeStampShared ? moment(sharedCourse.timeStampShared) : undefined;
        sharedCourse.timeStampStart = sharedCourse.timeStampStart ? moment(sharedCourse.timeStampStart) : undefined;
        sharedCourse.timeStampEnd = sharedCourse.timeStampEnd ? moment(sharedCourse.timeStampEnd) : undefined;
      });
    }
    return res;
  }
}
