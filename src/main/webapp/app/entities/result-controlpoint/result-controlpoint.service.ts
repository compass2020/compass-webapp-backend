import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as moment from 'moment';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared/util/request-util';
import { IResultControlpoint } from 'app/shared/model/result-controlpoint.model';

type EntityResponseType = HttpResponse<IResultControlpoint>;
type EntityArrayResponseType = HttpResponse<IResultControlpoint[]>;

@Injectable({ providedIn: 'root' })
export class ResultControlpointService {
  public resourceUrl = SERVER_API_URL + 'api/result-controlpoints';

  constructor(protected http: HttpClient) {}

  create(resultControlpoint: IResultControlpoint): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(resultControlpoint);
    return this.http
      .post<IResultControlpoint>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(resultControlpoint: IResultControlpoint): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(resultControlpoint);
    return this.http
      .put<IResultControlpoint>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IResultControlpoint>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IResultControlpoint[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  protected convertDateFromClient(resultControlpoint: IResultControlpoint): IResultControlpoint {
    const copy: IResultControlpoint = Object.assign({}, resultControlpoint, {
      timeReached:
        resultControlpoint.timeReached && resultControlpoint.timeReached.isValid() ? resultControlpoint.timeReached.toJSON() : undefined,
    });
    return copy;
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.timeReached = res.body.timeReached ? moment(res.body.timeReached) : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((resultControlpoint: IResultControlpoint) => {
        resultControlpoint.timeReached = resultControlpoint.timeReached ? moment(resultControlpoint.timeReached) : undefined;
      });
    }
    return res;
  }
}
