import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Routes, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { flatMap } from 'rxjs/operators';

import { Authority } from 'app/shared/constants/authority.constants';
import { UserRouteAccessService } from 'app/core/auth/user-route-access-service';
import { IResultQuestion, ResultQuestion } from 'app/shared/model/result-question.model';
import { ResultQuestionService } from './result-question.service';
import { ResultQuestionComponent } from './result-question.component';
import { ResultQuestionDetailComponent } from './result-question-detail.component';
import { ResultQuestionUpdateComponent } from './result-question-update.component';

@Injectable({ providedIn: 'root' })
export class ResultQuestionResolve implements Resolve<IResultQuestion> {
  constructor(private service: ResultQuestionService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IResultQuestion> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        flatMap((resultQuestion: HttpResponse<ResultQuestion>) => {
          if (resultQuestion.body) {
            return of(resultQuestion.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new ResultQuestion());
  }
}

export const resultQuestionRoute: Routes = [
  {
    path: '',
    component: ResultQuestionComponent,
    data: {
      authorities: [Authority.USER],
      pageTitle: 'compassApp.resultQuestion.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ResultQuestionDetailComponent,
    resolve: {
      resultQuestion: ResultQuestionResolve,
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'compassApp.resultQuestion.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ResultQuestionUpdateComponent,
    resolve: {
      resultQuestion: ResultQuestionResolve,
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'compassApp.resultQuestion.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ResultQuestionUpdateComponent,
    resolve: {
      resultQuestion: ResultQuestionResolve,
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'compassApp.resultQuestion.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
];
