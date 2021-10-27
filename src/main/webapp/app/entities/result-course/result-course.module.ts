import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { CompassSharedModule } from 'app/shared/shared.module';
import { ResultCourseComponent } from './result-course.component';
import { ResultCourseDetailComponent } from './result-course-detail.component';
import { ResultCourseUpdateComponent } from './result-course-update.component';
import { ResultCourseDeleteDialogComponent } from './result-course-delete-dialog.component';
import { resultCourseRoute } from './result-course.route';

@NgModule({
  imports: [CompassSharedModule, RouterModule.forChild(resultCourseRoute)],
  declarations: [ResultCourseComponent, ResultCourseDetailComponent, ResultCourseUpdateComponent, ResultCourseDeleteDialogComponent],
  entryComponents: [ResultCourseDeleteDialogComponent],
})
export class CompassResultCourseModule {}
