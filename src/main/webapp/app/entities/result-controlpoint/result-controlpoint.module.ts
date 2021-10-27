import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { CompassSharedModule } from 'app/shared/shared.module';
import { ResultControlpointComponent } from './result-controlpoint.component';
import { ResultControlpointDetailComponent } from './result-controlpoint-detail.component';
import { ResultControlpointUpdateComponent } from './result-controlpoint-update.component';
import { ResultControlpointDeleteDialogComponent } from './result-controlpoint-delete-dialog.component';
import { resultControlpointRoute } from './result-controlpoint.route';

@NgModule({
  imports: [CompassSharedModule, RouterModule.forChild(resultControlpointRoute)],
  declarations: [
    ResultControlpointComponent,
    ResultControlpointDetailComponent,
    ResultControlpointUpdateComponent,
    ResultControlpointDeleteDialogComponent,
  ],
  entryComponents: [ResultControlpointDeleteDialogComponent],
})
export class CompassResultControlpointModule {}
