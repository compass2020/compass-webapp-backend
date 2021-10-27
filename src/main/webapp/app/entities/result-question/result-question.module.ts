import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { CompassSharedModule } from 'app/shared/shared.module';
import { ResultQuestionComponent } from './result-question.component';
import { ResultQuestionDetailComponent } from './result-question-detail.component';
import { ResultQuestionUpdateComponent } from './result-question-update.component';
import { ResultQuestionDeleteDialogComponent } from './result-question-delete-dialog.component';
import { resultQuestionRoute } from './result-question.route';

@NgModule({
  imports: [CompassSharedModule, RouterModule.forChild(resultQuestionRoute)],
  declarations: [
    ResultQuestionComponent,
    ResultQuestionDetailComponent,
    ResultQuestionUpdateComponent,
    ResultQuestionDeleteDialogComponent,
  ],
  entryComponents: [ResultQuestionDeleteDialogComponent],
})
export class CompassResultQuestionModule {}
