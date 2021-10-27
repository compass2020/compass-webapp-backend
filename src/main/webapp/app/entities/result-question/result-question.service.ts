import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared/util/request-util';
import { IResultQuestion } from 'app/shared/model/result-question.model';

type EntityResponseType = HttpResponse<IResultQuestion>;
type EntityArrayResponseType = HttpResponse<IResultQuestion[]>;

@Injectable({ providedIn: 'root' })
export class ResultQuestionService {
  public resourceUrl = SERVER_API_URL + 'api/result-questions';

  constructor(protected http: HttpClient) {}

  create(resultQuestion: IResultQuestion): Observable<EntityResponseType> {
    return this.http.post<IResultQuestion>(this.resourceUrl, resultQuestion, { observe: 'response' });
  }

  update(resultQuestion: IResultQuestion): Observable<EntityResponseType> {
    return this.http.put<IResultQuestion>(this.resourceUrl, resultQuestion, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IResultQuestion>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IResultQuestion[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }
}
