import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access-service';
import { MyCoursesComponent } from './my-courses.component';
import { ShareQrcodeComponent } from 'app/share-qrcode/share-qrcode.component';
import { PrintQrcodesComponent } from 'app/print-qrcodes/print-qrcodes.component';
import { PrintMapComponent } from 'app/print-map/print-map.component';
import { CanDeactivateMonitorGuard, MonitorSessionComponent } from 'app/monitor-session/monitor-session.component';
import { PrintShareQrcodesComponent } from 'app/print-share-qrcodes/print-share-qrcodes.component';
import { CanDeactivateGuard, CreateCourseComponent } from 'app/create-course';

export const MY_COURSES_ROUTES: Routes = [
  {
    path: 'my-courses',
    component: MyCoursesComponent,
    data: {
      authorities: [],
      pageTitle: 'my-courses.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'shareQR/:id',
    component: ShareQrcodeComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'pageTitle.shareSession',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'monitorSession/:id/:courseID',
    component: MonitorSessionComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'pageTitle.monitorSession',
    },
    canActivate: [UserRouteAccessService],
    canDeactivate: [CanDeactivateMonitorGuard],
  },
  {
    path: 'printQRs/:id',
    component: PrintQrcodesComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'pageTitle.printQRs',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'printShareQRs/:id',
    component: PrintShareQrcodesComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'pageTitle.printQRs',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'printMap/:id',
    component: PrintMapComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'pageTitle.printMap',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'create-course/:id',
    component: CreateCourseComponent,
    data: {
      authorities: [],
      pageTitle: 'create-course.title',
    },
    canActivate: [UserRouteAccessService],
    canDeactivate: [CanDeactivateGuard],
  },
];
