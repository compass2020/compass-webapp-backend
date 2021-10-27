import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { CompassSharedModule } from '../shared/shared.module';

import { RESULT_SESSIONS_ROUTES, ResultSessionsComponent } from './';

@NgModule({
  imports: [CompassSharedModule, RouterModule.forRoot(RESULT_SESSIONS_ROUTES, { useHash: true })],
  declarations: [ResultSessionsComponent],
  entryComponents: [],
  providers: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class CompassAppResultSessionsModule {}
