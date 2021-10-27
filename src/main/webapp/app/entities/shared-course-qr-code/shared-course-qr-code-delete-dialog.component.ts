import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { ISharedCourseQrCode } from 'app/shared/model/shared-course-qr-code.model';
import { SharedCourseQrCodeService } from './shared-course-qr-code.service';

@Component({
  templateUrl: './shared-course-qr-code-delete-dialog.component.html',
})
export class SharedCourseQrCodeDeleteDialogComponent {
  sharedCourseQrCode?: ISharedCourseQrCode;

  constructor(
    protected sharedCourseQrCodeService: SharedCourseQrCodeService,
    public activeModal: NgbActiveModal,
    protected eventManager: JhiEventManager
  ) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.sharedCourseQrCodeService.delete(id).subscribe(() => {
      this.eventManager.broadcast('sharedCourseQrCodeListModification');
      this.activeModal.close();
    });
  }
}
