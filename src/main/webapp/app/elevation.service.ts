import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Controlpoint } from './shared/model/controlpoint.model';

@Injectable({ providedIn: 'root' })
export class ElevationService {
  public resourceUrl = 'https://api.airmap.com/elevation/v1/ele';

  constructor(protected http: HttpClient) {}

  getElevation(controlpoint: Controlpoint): Observable<any> {
    const url = this.resourceUrl + '?points=' + controlpoint.latitude + ',' + controlpoint.longitude;
    try {
      return this.http.get<any>(url, { observe: 'response' });
    } catch {
      return null;
    }
  }
}
