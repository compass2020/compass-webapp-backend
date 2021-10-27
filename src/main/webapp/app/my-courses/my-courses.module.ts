import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CanDeactivateMonitorGuard } from 'app/monitor-session/monitor-session.component';

import { CompassSharedModule } from '../shared/shared.module';

import { MY_COURSES_ROUTES, MyCoursesComponent } from './';

@NgModule({
  imports: [CompassSharedModule, RouterModule.forRoot(MY_COURSES_ROUTES, { useHash: true })],
  declarations: [MyCoursesComponent],
  entryComponents: [],
  providers: [CanDeactivateMonitorGuard],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class CompassAppMyCoursesModule {}
