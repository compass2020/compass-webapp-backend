import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Routes, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { flatMap } from 'rxjs/operators';

import { Authority } from 'app/shared/constants/authority.constants';
import { UserRouteAccessService } from 'app/core/auth/user-route-access-service';
import { IResultAdditionalInfo, ResultAdditionalInfo } from 'app/shared/model/result-additional-info.model';
import { ResultAdditionalInfoService } from './result-additional-info.service';
import { ResultAdditionalInfoComponent } from './result-additional-info.component';
import { ResultAdditionalInfoDetailComponent } from './result-additional-info-detail.component';
import { ResultAdditionalInfoUpdateComponent } from './result-additional-info-update.component';

@Injectable({ providedIn: 'root' })
export class ResultAdditionalInfoResolve implements Resolve<IResultAdditionalInfo> {
  constructor(private service: ResultAdditionalInfoService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IResultAdditionalInfo> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        flatMap((resultAdditionalInfo: HttpResponse<ResultAdditionalInfo>) => {
          if (resultAdditionalInfo.body) {
            return of(resultAdditionalInfo.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new ResultAdditionalInfo());
  }
}

export const resultAdditionalInfoRoute: Routes = [
  {
    path: '',
    component: ResultAdditionalInfoComponent,
    data: {
      authorities: [Authority.USER],
      pageTitle: 'compassApp.resultAdditionalInfo.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ResultAdditionalInfoDetailComponent,
    resolve: {
      resultAdditionalInfo: ResultAdditionalInfoResolve,
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'compassApp.resultAdditionalInfo.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ResultAdditionalInfoUpdateComponent,
    resolve: {
      resultAdditionalInfo: ResultAdditionalInfoResolve,
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'compassApp.resultAdditionalInfo.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ResultAdditionalInfoUpdateComponent,
    resolve: {
      resultAdditionalInfo: ResultAdditionalInfoResolve,
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'compassApp.resultAdditionalInfo.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
];
