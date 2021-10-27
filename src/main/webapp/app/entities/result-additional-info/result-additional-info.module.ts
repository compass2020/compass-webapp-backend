import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { CompassSharedModule } from 'app/shared/shared.module';
import { ResultAdditionalInfoComponent } from './result-additional-info.component';
import { ResultAdditionalInfoDetailComponent } from './result-additional-info-detail.component';
import { ResultAdditionalInfoUpdateComponent } from './result-additional-info-update.component';
import { ResultAdditionalInfoDeleteDialogComponent } from './result-additional-info-delete-dialog.component';
import { resultAdditionalInfoRoute } from './result-additional-info.route';

@NgModule({
  imports: [CompassSharedModule, RouterModule.forChild(resultAdditionalInfoRoute)],
  declarations: [
    ResultAdditionalInfoComponent,
    ResultAdditionalInfoDetailComponent,
    ResultAdditionalInfoUpdateComponent,
    ResultAdditionalInfoDeleteDialogComponent,
  ],
  entryComponents: [ResultAdditionalInfoDeleteDialogComponent],
})
export class CompassResultAdditionalInfoModule {}
