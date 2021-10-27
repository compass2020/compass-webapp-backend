import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { CompassSharedModule } from 'app/shared/shared.module';
import { SharedCourseComponent } from './shared-course.component';
import { SharedCourseDetailComponent } from './shared-course-detail.component';
import { SharedCourseUpdateComponent } from './shared-course-update.component';
import { SharedCourseDeleteDialogComponent } from './shared-course-delete-dialog.component';
import { sharedCourseRoute } from './shared-course.route';

@NgModule({
  imports: [CompassSharedModule, RouterModule.forChild(sharedCourseRoute)],
  declarations: [SharedCourseComponent, SharedCourseDetailComponent, SharedCourseUpdateComponent, SharedCourseDeleteDialogComponent],
  entryComponents: [SharedCourseDeleteDialogComponent],
})
export class CompassSharedCourseModule {}
