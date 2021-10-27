import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Routes, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { flatMap } from 'rxjs/operators';

import { Authority } from 'app/shared/constants/authority.constants';
import { UserRouteAccessService } from 'app/core/auth/user-route-access-service';
import { ISharedCourse, SharedCourse } from 'app/shared/model/shared-course.model';
import { SharedCourseService } from './shared-course.service';
import { SharedCourseComponent } from './shared-course.component';
import { SharedCourseDetailComponent } from './shared-course-detail.component';
import { SharedCourseUpdateComponent } from './shared-course-update.component';

@Injectable({ providedIn: 'root' })
export class SharedCourseResolve implements Resolve<ISharedCourse> {
  constructor(private service: SharedCourseService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ISharedCourse> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        flatMap((sharedCourse: HttpResponse<SharedCourse>) => {
          if (sharedCourse.body) {
            return of(sharedCourse.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new SharedCourse());
  }
}

export const sharedCourseRoute: Routes = [
  {
    path: '',
    component: SharedCourseComponent,
    data: {
      authorities: [Authority.USER],
      pageTitle: 'compassApp.sharedCourse.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: SharedCourseDetailComponent,
    resolve: {
      sharedCourse: SharedCourseResolve,
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'compassApp.sharedCourse.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: SharedCourseUpdateComponent,
    resolve: {
      sharedCourse: SharedCourseResolve,
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'compassApp.sharedCourse.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: SharedCourseUpdateComponent,
    resolve: {
      sharedCourse: SharedCourseResolve,
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'compassApp.sharedCourse.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
];
