import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Routes, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { flatMap } from 'rxjs/operators';

import { Authority } from 'app/shared/constants/authority.constants';
import { UserRouteAccessService } from 'app/core/auth/user-route-access-service';
import { IOrienteeringMap, OrienteeringMap } from 'app/shared/model/orienteering-map.model';
import { OrienteeringMapService } from './orienteering-map.service';
import { OrienteeringMapComponent } from './orienteering-map.component';
import { OrienteeringMapDetailComponent } from './orienteering-map-detail.component';
import { OrienteeringMapUpdateComponent } from './orienteering-map-update.component';

@Injectable({ providedIn: 'root' })
export class OrienteeringMapResolve implements Resolve<IOrienteeringMap> {
  constructor(private service: OrienteeringMapService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IOrienteeringMap> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        flatMap((orienteeringMap: HttpResponse<OrienteeringMap>) => {
          if (orienteeringMap.body) {
            return of(orienteeringMap.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new OrienteeringMap());
  }
}

export const orienteeringMapRoute: Routes = [
  {
    path: '',
    component: OrienteeringMapComponent,
    data: {
      authorities: [Authority.USER],
      pageTitle: 'compassApp.orienteeringMap.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: OrienteeringMapDetailComponent,
    resolve: {
      orienteeringMap: OrienteeringMapResolve,
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'compassApp.orienteeringMap.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: OrienteeringMapUpdateComponent,
    resolve: {
      orienteeringMap: OrienteeringMapResolve,
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'compassApp.orienteeringMap.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: OrienteeringMapUpdateComponent,
    resolve: {
      orienteeringMap: OrienteeringMapResolve,
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'compassApp.orienteeringMap.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
];
