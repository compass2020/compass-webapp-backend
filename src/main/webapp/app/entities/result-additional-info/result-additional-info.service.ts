import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared/util/request-util';
import { IResultAdditionalInfo } from 'app/shared/model/result-additional-info.model';

type EntityResponseType = HttpResponse<IResultAdditionalInfo>;
type EntityArrayResponseType = HttpResponse<IResultAdditionalInfo[]>;

@Injectable({ providedIn: 'root' })
export class ResultAdditionalInfoService {
  public resourceUrl = SERVER_API_URL + 'api/result-additional-infos';

  constructor(protected http: HttpClient) {}

  create(resultAdditionalInfo: IResultAdditionalInfo): Observable<EntityResponseType> {
    return this.http.post<IResultAdditionalInfo>(this.resourceUrl, resultAdditionalInfo, { observe: 'response' });
  }

  update(resultAdditionalInfo: IResultAdditionalInfo): Observable<EntityResponseType> {
    return this.http.put<IResultAdditionalInfo>(this.resourceUrl, resultAdditionalInfo, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IResultAdditionalInfo>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  findByResultCourseID(id: number): Observable<EntityResponseType> {
    return this.http.get<IResultAdditionalInfo>(`${this.resourceUrl}/result-course/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IResultAdditionalInfo[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }
}
