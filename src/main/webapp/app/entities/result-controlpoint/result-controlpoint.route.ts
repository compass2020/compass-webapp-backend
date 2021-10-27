import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Routes, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { flatMap } from 'rxjs/operators';

import { Authority } from 'app/shared/constants/authority.constants';
import { UserRouteAccessService } from 'app/core/auth/user-route-access-service';
import { IResultControlpoint, ResultControlpoint } from 'app/shared/model/result-controlpoint.model';
import { ResultControlpointService } from './result-controlpoint.service';
import { ResultControlpointComponent } from './result-controlpoint.component';
import { ResultControlpointDetailComponent } from './result-controlpoint-detail.component';
import { ResultControlpointUpdateComponent } from './result-controlpoint-update.component';

@Injectable({ providedIn: 'root' })
export class ResultControlpointResolve implements Resolve<IResultControlpoint> {
  constructor(private service: ResultControlpointService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IResultControlpoint> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        flatMap((resultControlpoint: HttpResponse<ResultControlpoint>) => {
          if (resultControlpoint.body) {
            return of(resultControlpoint.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new ResultControlpoint());
  }
}

export const resultControlpointRoute: Routes = [
  {
    path: '',
    component: ResultControlpointComponent,
    data: {
      authorities: [Authority.USER],
      pageTitle: 'compassApp.resultControlpoint.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ResultControlpointDetailComponent,
    resolve: {
      resultControlpoint: ResultControlpointResolve,
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'compassApp.resultControlpoint.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ResultControlpointUpdateComponent,
    resolve: {
      resultControlpoint: ResultControlpointResolve,
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'compassApp.resultControlpoint.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ResultControlpointUpdateComponent,
    resolve: {
      resultControlpoint: ResultControlpointResolve,
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'compassApp.resultControlpoint.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
];
