import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Routes, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { flatMap } from 'rxjs/operators';

import { Authority } from 'app/shared/constants/authority.constants';
import { UserRouteAccessService } from 'app/core/auth/user-route-access-service';
import { IControlpoint, Controlpoint } from 'app/shared/model/controlpoint.model';
import { ControlpointService } from './controlpoint.service';
import { ControlpointComponent } from './controlpoint.component';
import { ControlpointDetailComponent } from './controlpoint-detail.component';
import { ControlpointUpdateComponent } from './controlpoint-update.component';

@Injectable({ providedIn: 'root' })
export class ControlpointResolve implements Resolve<IControlpoint> {
  constructor(private service: ControlpointService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IControlpoint> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        flatMap((controlpoint: HttpResponse<Controlpoint>) => {
          if (controlpoint.body) {
            return of(controlpoint.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Controlpoint());
  }
}

export const controlpointRoute: Routes = [
  {
    path: '',
    component: ControlpointComponent,
    data: {
      authorities: [Authority.USER],
      pageTitle: 'compassApp.controlpoint.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ControlpointDetailComponent,
    resolve: {
      controlpoint: ControlpointResolve,
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'compassApp.controlpoint.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ControlpointUpdateComponent,
    resolve: {
      controlpoint: ControlpointResolve,
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'compassApp.controlpoint.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ControlpointUpdateComponent,
    resolve: {
      controlpoint: ControlpointResolve,
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'compassApp.controlpoint.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
];
