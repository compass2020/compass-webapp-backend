import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared/util/request-util';
import { IOrienteeringMap } from 'app/shared/model/orienteering-map.model';

type EntityResponseType = HttpResponse<IOrienteeringMap>;
type EntityArrayResponseType = HttpResponse<IOrienteeringMap[]>;

@Injectable({ providedIn: 'root' })
export class OrienteeringMapService {
  public resourceUrl = SERVER_API_URL + 'api/orienteering-maps';

  constructor(protected http: HttpClient) {}

  create(orienteeringMap: IOrienteeringMap): Observable<EntityResponseType> {
    return this.http.post<IOrienteeringMap>(this.resourceUrl, orienteeringMap, { observe: 'response' });
  }

  update(orienteeringMap: IOrienteeringMap): Observable<EntityResponseType> {
    return this.http.put<IOrienteeringMap>(this.resourceUrl, orienteeringMap, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IOrienteeringMap>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IOrienteeringMap[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }
}
