import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared/util/request-util';
import { IControlpointInfo } from 'app/shared/model/controlpoint-info.model';

type EntityResponseType = HttpResponse<IControlpointInfo>;
type EntityArrayResponseType = HttpResponse<IControlpointInfo[]>;

@Injectable({ providedIn: 'root' })
export class ControlpointInfoService {
  public resourceUrl = SERVER_API_URL + 'api/controlpoint-infos';

  constructor(protected http: HttpClient) {}

  create(controlpointInfo: IControlpointInfo): Observable<EntityResponseType> {
    return this.http.post<IControlpointInfo>(this.resourceUrl, controlpointInfo, { observe: 'response' });
  }

  update(controlpointInfo: IControlpointInfo): Observable<EntityResponseType> {
    return this.http.put<IControlpointInfo>(this.resourceUrl, controlpointInfo, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IControlpointInfo>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IControlpointInfo[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }
}
