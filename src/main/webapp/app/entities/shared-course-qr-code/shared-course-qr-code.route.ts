import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Routes, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { flatMap } from 'rxjs/operators';

import { Authority } from 'app/shared/constants/authority.constants';
import { UserRouteAccessService } from 'app/core/auth/user-route-access-service';
import { ISharedCourseQrCode, SharedCourseQrCode } from 'app/shared/model/shared-course-qr-code.model';
import { SharedCourseQrCodeService } from './shared-course-qr-code.service';
import { SharedCourseQrCodeComponent } from './shared-course-qr-code.component';
import { SharedCourseQrCodeDetailComponent } from './shared-course-qr-code-detail.component';
import { SharedCourseQrCodeUpdateComponent } from './shared-course-qr-code-update.component';

@Injectable({ providedIn: 'root' })
export class SharedCourseQrCodeResolve implements Resolve<ISharedCourseQrCode> {
  constructor(private service: SharedCourseQrCodeService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ISharedCourseQrCode> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        flatMap((sharedCourseQrCode: HttpResponse<SharedCourseQrCode>) => {
          if (sharedCourseQrCode.body) {
            return of(sharedCourseQrCode.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new SharedCourseQrCode());
  }
}

export const sharedCourseQrCodeRoute: Routes = [
  {
    path: '',
    component: SharedCourseQrCodeComponent,
    data: {
      authorities: [Authority.USER],
      pageTitle: 'compassApp.sharedCourseQrCode.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: SharedCourseQrCodeDetailComponent,
    resolve: {
      sharedCourseQrCode: SharedCourseQrCodeResolve,
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'compassApp.sharedCourseQrCode.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: SharedCourseQrCodeUpdateComponent,
    resolve: {
      sharedCourseQrCode: SharedCourseQrCodeResolve,
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'compassApp.sharedCourseQrCode.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: SharedCourseQrCodeUpdateComponent,
    resolve: {
      sharedCourseQrCode: SharedCourseQrCodeResolve,
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'compassApp.sharedCourseQrCode.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
];
