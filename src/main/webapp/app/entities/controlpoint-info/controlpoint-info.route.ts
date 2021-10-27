import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Routes, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { flatMap } from 'rxjs/operators';

import { Authority } from 'app/shared/constants/authority.constants';
import { UserRouteAccessService } from 'app/core/auth/user-route-access-service';
import { IControlpointInfo, ControlpointInfo } from 'app/shared/model/controlpoint-info.model';
import { ControlpointInfoService } from './controlpoint-info.service';
import { ControlpointInfoComponent } from './controlpoint-info.component';
import { ControlpointInfoDetailComponent } from './controlpoint-info-detail.component';
import { ControlpointInfoUpdateComponent } from './controlpoint-info-update.component';

@Injectable({ providedIn: 'root' })
export class ControlpointInfoResolve implements Resolve<IControlpointInfo> {
  constructor(private service: ControlpointInfoService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IControlpointInfo> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        flatMap((controlpointInfo: HttpResponse<ControlpointInfo>) => {
          if (controlpointInfo.body) {
            return of(controlpointInfo.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new ControlpointInfo());
  }
}

export const controlpointInfoRoute: Routes = [
  {
    path: '',
    component: ControlpointInfoComponent,
    data: {
      authorities: [Authority.USER],
      pageTitle: 'compassApp.controlpointInfo.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ControlpointInfoDetailComponent,
    resolve: {
      controlpointInfo: ControlpointInfoResolve,
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'compassApp.controlpointInfo.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ControlpointInfoUpdateComponent,
    resolve: {
      controlpointInfo: ControlpointInfoResolve,
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'compassApp.controlpointInfo.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ControlpointInfoUpdateComponent,
    resolve: {
      controlpointInfo: ControlpointInfoResolve,
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'compassApp.controlpointInfo.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
];
