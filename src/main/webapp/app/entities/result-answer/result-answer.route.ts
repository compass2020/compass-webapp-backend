import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Routes, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { flatMap } from 'rxjs/operators';

import { Authority } from 'app/shared/constants/authority.constants';
import { UserRouteAccessService } from 'app/core/auth/user-route-access-service';
import { IResultAnswer, ResultAnswer } from 'app/shared/model/result-answer.model';
import { ResultAnswerService } from './result-answer.service';
import { ResultAnswerComponent } from './result-answer.component';
import { ResultAnswerDetailComponent } from './result-answer-detail.component';
import { ResultAnswerUpdateComponent } from './result-answer-update.component';

@Injectable({ providedIn: 'root' })
export class ResultAnswerResolve implements Resolve<IResultAnswer> {
  constructor(private service: ResultAnswerService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IResultAnswer> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        flatMap((resultAnswer: HttpResponse<ResultAnswer>) => {
          if (resultAnswer.body) {
            return of(resultAnswer.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new ResultAnswer());
  }
}

export const resultAnswerRoute: Routes = [
  {
    path: '',
    component: ResultAnswerComponent,
    data: {
      authorities: [Authority.USER],
      pageTitle: 'compassApp.resultAnswer.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ResultAnswerDetailComponent,
    resolve: {
      resultAnswer: ResultAnswerResolve,
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'compassApp.resultAnswer.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ResultAnswerUpdateComponent,
    resolve: {
      resultAnswer: ResultAnswerResolve,
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'compassApp.resultAnswer.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ResultAnswerUpdateComponent,
    resolve: {
      resultAnswer: ResultAnswerResolve,
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'compassApp.resultAnswer.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
];
