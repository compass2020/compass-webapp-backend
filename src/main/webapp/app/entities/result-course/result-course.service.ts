import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as moment from 'moment';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared/util/request-util';
import { IResultCourse } from 'app/shared/model/result-course.model';

type EntityResponseType = HttpResponse<IResultCourse>;
type EntityArrayResponseType = HttpResponse<IResultCourse[]>;

@Injectable({ providedIn: 'root' })
export class ResultCourseService {
  public resourceUrl = SERVER_API_URL + 'api/result-courses';

  constructor(protected http: HttpClient) {}

  create(resultCourse: IResultCourse): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(resultCourse);
    return this.http
      .post<IResultCourse>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(resultCourse: IResultCourse): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(resultCourse);
    return this.http
      .put<IResultCourse>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IResultCourse>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IResultCourse[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getFromViewCode(sharedCourseID: number, viewCode: string, fetchCourse: boolean): Observable<EntityResponseType> {
    return this.http
      .get<IResultCourse>(SERVER_API_URL + `view/result-courses/viewcode/${sharedCourseID}/${viewCode}?fetchCourse=${fetchCourse}`, {
        observe: 'response',
      })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  protected convertDateFromClient(resultCourse: IResultCourse): IResultCourse {
    const copy: IResultCourse = Object.assign({}, resultCourse, {
      timeStampFinished:
        resultCourse.timeStampFinished && resultCourse.timeStampFinished.isValid() ? resultCourse.timeStampFinished.toJSON() : undefined,
      timeStampStarted:
        resultCourse.timeStampStarted && resultCourse.timeStampStarted.isValid() ? resultCourse.timeStampStarted.toJSON() : undefined,
    });
    return copy;
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.timeStampFinished = res.body.timeStampFinished ? moment(res.body.timeStampFinished) : undefined;
      res.body.timeStampStarted = res.body.timeStampStarted ? moment(res.body.timeStampStarted) : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((resultCourse: IResultCourse) => {
        resultCourse.timeStampFinished = resultCourse.timeStampFinished ? moment(resultCourse.timeStampFinished) : undefined;
        resultCourse.timeStampStarted = resultCourse.timeStampStarted ? moment(resultCourse.timeStampStarted) : undefined;
      });
    }
    return res;
  }
}
