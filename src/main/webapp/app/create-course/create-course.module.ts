import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { CompassSharedModule } from '../shared/shared.module';

import { CREATE_COURSE_ROUTE, CreateCourseComponent, CanDeactivateGuard } from './';
import { MapComponent } from 'app/map/map.component';
import { ControlpointListComponent } from 'app/controlpoint-list/controlpoint-list.component';
import { ControlpointDetailsComponent } from 'app/controlpoint-details/controlpoint-details.component';

@NgModule({
  imports: [CompassSharedModule, RouterModule.forRoot([CREATE_COURSE_ROUTE], { useHash: true })],
  declarations: [CreateCourseComponent, MapComponent, ControlpointDetailsComponent, ControlpointListComponent],
  entryComponents: [],
  providers: [CanDeactivateGuard],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class CompassAppCreateCourseModule {}
