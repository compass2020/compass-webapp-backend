import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared/util/request-util';
import { IResultAnswer } from 'app/shared/model/result-answer.model';

type EntityResponseType = HttpResponse<IResultAnswer>;
type EntityArrayResponseType = HttpResponse<IResultAnswer[]>;

@Injectable({ providedIn: 'root' })
export class ResultAnswerService {
  public resourceUrl = SERVER_API_URL + 'api/result-answers';

  constructor(protected http: HttpClient) {}

  create(resultAnswer: IResultAnswer): Observable<EntityResponseType> {
    return this.http.post<IResultAnswer>(this.resourceUrl, resultAnswer, { observe: 'response' });
  }

  update(resultAnswer: IResultAnswer): Observable<EntityResponseType> {
    return this.http.put<IResultAnswer>(this.resourceUrl, resultAnswer, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IResultAnswer>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IResultAnswer[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }
}
