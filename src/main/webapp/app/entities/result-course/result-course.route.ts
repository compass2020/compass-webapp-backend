import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Routes, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { flatMap } from 'rxjs/operators';

import { Authority } from 'app/shared/constants/authority.constants';
import { UserRouteAccessService } from 'app/core/auth/user-route-access-service';
import { IResultCourse, ResultCourse } from 'app/shared/model/result-course.model';
import { ResultCourseService } from './result-course.service';
import { ResultCourseComponent } from './result-course.component';
import { ResultCourseDetailComponent } from './result-course-detail.component';
import { ResultCourseUpdateComponent } from './result-course-update.component';

@Injectable({ providedIn: 'root' })
export class ResultCourseResolve implements Resolve<IResultCourse> {
  constructor(private service: ResultCourseService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IResultCourse> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        flatMap((resultCourse: HttpResponse<ResultCourse>) => {
          if (resultCourse.body) {
            return of(resultCourse.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new ResultCourse());
  }
}

export const resultCourseRoute: Routes = [
  {
    path: '',
    component: ResultCourseComponent,
    data: {
      authorities: [Authority.USER],
      pageTitle: 'compassApp.resultCourse.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ResultCourseDetailComponent,
    resolve: {
      resultCourse: ResultCourseResolve,
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'compassApp.resultCourse.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ResultCourseUpdateComponent,
    resolve: {
      resultCourse: ResultCourseResolve,
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'compassApp.resultCourse.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ResultCourseUpdateComponent,
    resolve: {
      resultCourse: ResultCourseResolve,
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'compassApp.resultCourse.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
];
