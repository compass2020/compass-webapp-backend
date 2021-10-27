import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { CompassSharedModule } from 'app/shared/shared.module';
import { ResultAnswerComponent } from './result-answer.component';
import { ResultAnswerDetailComponent } from './result-answer-detail.component';
import { ResultAnswerUpdateComponent } from './result-answer-update.component';
import { ResultAnswerDeleteDialogComponent } from './result-answer-delete-dialog.component';
import { resultAnswerRoute } from './result-answer.route';

@NgModule({
  imports: [CompassSharedModule, RouterModule.forChild(resultAnswerRoute)],
  declarations: [ResultAnswerComponent, ResultAnswerDetailComponent, ResultAnswerUpdateComponent, ResultAnswerDeleteDialogComponent],
  entryComponents: [ResultAnswerDeleteDialogComponent],
})
export class CompassResultAnswerModule {}
