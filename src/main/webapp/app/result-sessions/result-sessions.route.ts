import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access-service';
import { FeedbackComponent } from 'app/feedback/feedback.component';
import { ViewComponent } from 'app/view/view.component';
import { ResultSessionsComponent } from './result-sessions.component';

export const RESULT_SESSIONS_ROUTES: Routes = [
  {
    path: 'result-sessions',
    component: ResultSessionsComponent,
    data: {
      authorities: [],
      pageTitle: 'results.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'feedback',
    component: FeedbackComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'results.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'feedback/:sharedCourseID',
    component: FeedbackComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'results.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'view/:sharedCourse/:viewCode',
    component: ViewComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'results.title',
    },
  },
];
