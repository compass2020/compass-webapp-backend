import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { CompassSharedModule } from 'app/shared/shared.module';
import { SharedCourseQrCodeComponent } from './shared-course-qr-code.component';
import { SharedCourseQrCodeDetailComponent } from './shared-course-qr-code-detail.component';
import { SharedCourseQrCodeUpdateComponent } from './shared-course-qr-code-update.component';
import { SharedCourseQrCodeDeleteDialogComponent } from './shared-course-qr-code-delete-dialog.component';
import { sharedCourseQrCodeRoute } from './shared-course-qr-code.route';

@NgModule({
  imports: [CompassSharedModule, RouterModule.forChild(sharedCourseQrCodeRoute)],
  declarations: [
    SharedCourseQrCodeComponent,
    SharedCourseQrCodeDetailComponent,
    SharedCourseQrCodeUpdateComponent,
    SharedCourseQrCodeDeleteDialogComponent,
  ],
  entryComponents: [SharedCourseQrCodeDeleteDialogComponent],
})
export class CompassSharedCourseQrCodeModule {}
