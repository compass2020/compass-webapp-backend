import { Route } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access-service';
import { CanDeactivateGuard, CreateCourseComponent } from './create-course.component';

export const CREATE_COURSE_ROUTE: Route = {
  path: 'create-course',
  component: CreateCourseComponent,
  data: {
    authorities: [],
    pageTitle: 'create-course.title',
  },
  canActivate: [UserRouteAccessService],
  canDeactivate: [CanDeactivateGuard],
};
