import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as moment from 'moment';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared/util/request-util';
import { ISharedCourseQrCode } from 'app/shared/model/shared-course-qr-code.model';

type EntityResponseType = HttpResponse<ISharedCourseQrCode>;
type EntityArrayResponseType = HttpResponse<ISharedCourseQrCode[]>;

@Injectable({ providedIn: 'root' })
export class SharedCourseQrCodeService {
  public resourceUrl = SERVER_API_URL + 'api/shared-course-qr-codes';

  constructor(protected http: HttpClient) {}

  create(sharedCourseQrCode: ISharedCourseQrCode): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(sharedCourseQrCode);
    return this.http
      .post<ISharedCourseQrCode>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(sharedCourseQrCode: ISharedCourseQrCode): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(sharedCourseQrCode);
    return this.http
      .put<ISharedCourseQrCode>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<ISharedCourseQrCode>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<ISharedCourseQrCode[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  protected convertDateFromClient(sharedCourseQrCode: ISharedCourseQrCode): ISharedCourseQrCode {
    const copy: ISharedCourseQrCode = Object.assign({}, sharedCourseQrCode, {
      timeStampScanned:
        sharedCourseQrCode.timeStampScanned && sharedCourseQrCode.timeStampScanned.isValid()
          ? sharedCourseQrCode.timeStampScanned.toJSON()
          : undefined,
    });
    return copy;
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.timeStampScanned = res.body.timeStampScanned ? moment(res.body.timeStampScanned) : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((sharedCourseQrCode: ISharedCourseQrCode) => {
        sharedCourseQrCode.timeStampScanned = sharedCourseQrCode.timeStampScanned ? moment(sharedCourseQrCode.timeStampScanned) : undefined;
      });
    }
    return res;
  }
}
