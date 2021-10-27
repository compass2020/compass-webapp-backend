import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared/util/request-util';
import { IControlpoint } from 'app/shared/model/controlpoint.model';

type EntityResponseType = HttpResponse<IControlpoint>;
type EntityArrayResponseType = HttpResponse<IControlpoint[]>;

@Injectable({ providedIn: 'root' })
export class ControlpointService {
  public resourceUrl = SERVER_API_URL + 'api/controlpoints';

  constructor(protected http: HttpClient) {}

  create(controlpoint: IControlpoint): Observable<EntityResponseType> {
    return this.http.post<IControlpoint>(this.resourceUrl, controlpoint, { observe: 'response' });
  }

  update(controlpoint: IControlpoint): Observable<EntityResponseType> {
    return this.http.put<IControlpoint>(this.resourceUrl, controlpoint, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IControlpoint>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IControlpoint[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }
}
