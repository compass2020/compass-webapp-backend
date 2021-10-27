import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { CompassSharedModule } from '../shared/shared.module';

import { MANAGE_QUESTIONS_ROUTE, ManageQuestionsComponent } from './';

@NgModule({
  imports: [CompassSharedModule, RouterModule.forRoot([MANAGE_QUESTIONS_ROUTE], { useHash: true })],
  declarations: [ManageQuestionsComponent],
  entryComponents: [],
  providers: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class CompassAppManageQuestionsModule {}
