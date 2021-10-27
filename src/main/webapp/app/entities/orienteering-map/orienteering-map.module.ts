import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { CompassSharedModule } from 'app/shared/shared.module';
import { OrienteeringMapComponent } from './orienteering-map.component';
import { OrienteeringMapDetailComponent } from './orienteering-map-detail.component';
import { OrienteeringMapUpdateComponent } from './orienteering-map-update.component';
import { OrienteeringMapDeleteDialogComponent } from './orienteering-map-delete-dialog.component';
import { orienteeringMapRoute } from './orienteering-map.route';

@NgModule({
  imports: [CompassSharedModule, RouterModule.forChild(orienteeringMapRoute)],
  declarations: [
    OrienteeringMapComponent,
    OrienteeringMapDetailComponent,
    OrienteeringMapUpdateComponent,
    OrienteeringMapDeleteDialogComponent,
  ],
  entryComponents: [OrienteeringMapDeleteDialogComponent],
})
export class CompassOrienteeringMapModule {}
