import { Route } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access-service';
import { ManageQuestionsComponent } from './manage-questions.component';

export const MANAGE_QUESTIONS_ROUTE: Route = {
  path: 'manage-questions',
  component: ManageQuestionsComponent,
  data: {
    authorities: [],
    pageTitle: 'menu.manage-questions',
  },
  canActivate: [UserRouteAccessService],
};
