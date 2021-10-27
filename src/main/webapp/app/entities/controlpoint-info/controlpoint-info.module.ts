import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { CompassSharedModule } from 'app/shared/shared.module';
import { ControlpointInfoComponent } from './controlpoint-info.component';
import { ControlpointInfoDetailComponent } from './controlpoint-info-detail.component';
import { ControlpointInfoUpdateComponent } from './controlpoint-info-update.component';
import { ControlpointInfoDeleteDialogComponent } from './controlpoint-info-delete-dialog.component';
import { controlpointInfoRoute } from './controlpoint-info.route';

@NgModule({
  imports: [CompassSharedModule, RouterModule.forChild(controlpointInfoRoute)],
  declarations: [
    ControlpointInfoComponent,
    ControlpointInfoDetailComponent,
    ControlpointInfoUpdateComponent,
    ControlpointInfoDeleteDialogComponent,
  ],
  entryComponents: [ControlpointInfoDeleteDialogComponent],
})
export class CompassControlpointInfoModule {}
