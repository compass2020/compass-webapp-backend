import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as moment from 'moment';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared/util/request-util';
import { IPosition } from 'app/shared/model/position.model';

type EntityResponseType = HttpResponse<IPosition>;
type EntityArrayResponseType = HttpResponse<IPosition[]>;

@Injectable({ providedIn: 'root' })
export class PositionService {
  public resourceUrl = SERVER_API_URL + 'api/position';

  constructor(protected http: HttpClient) {}

  create(position: IPosition): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(position);
    return this.http
      .post<IPosition>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(position: IPosition): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(position);
    return this.http
      .put<IPosition>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IPosition>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IPosition[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  getPositionsForSharedCourse(id: number): Observable<EntityArrayResponseType> {
    return this.http.get<IPosition[]>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  protected convertDateFromClient(position: IPosition): IPosition {
    const copy: IPosition = Object.assign({}, position, {
      timeStampShared: position.timestamp /*  && position.timeStampShared.isValid() ? position.timeStampShared.toJSON() : undefined, */,
    });
    return copy;
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.timestamp = res.body.timestamp ? moment(res.body.timestamp) : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((position: IPosition) => {
        position.timestamp = position.timestamp ? moment(position.timestamp) : undefined;
      });
    }
    return res;
  }
}
