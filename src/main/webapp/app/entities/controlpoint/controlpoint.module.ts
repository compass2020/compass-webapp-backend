import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { CompassSharedModule } from 'app/shared/shared.module';
import { ControlpointComponent } from './controlpoint.component';
import { ControlpointDetailComponent } from './controlpoint-detail.component';
import { ControlpointUpdateComponent } from './controlpoint-update.component';
import { ControlpointDeleteDialogComponent } from './controlpoint-delete-dialog.component';
import { controlpointRoute } from './controlpoint.route';

@NgModule({
  imports: [CompassSharedModule, RouterModule.forChild(controlpointRoute)],
  declarations: [ControlpointComponent, ControlpointDetailComponent, ControlpointUpdateComponent, ControlpointDeleteDialogComponent],
  entryComponents: [ControlpointDeleteDialogComponent],
})
export class CompassControlpointModule {}
