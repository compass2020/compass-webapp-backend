import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IControlpointInfo } from 'app/shared/model/controlpoint-info.model';
import { ControlpointInfoService } from './controlpoint-info.service';

@Component({
  templateUrl: './controlpoint-info-delete-dialog.component.html',
})
export class ControlpointInfoDeleteDialogComponent {
  controlpointInfo?: IControlpointInfo;

  constructor(
    protected controlpointInfoService: ControlpointInfoService,
    public activeModal: NgbActiveModal,
    protected eventManager: JhiEventManager
  ) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.controlpointInfoService.delete(id).subscribe(() => {
      this.eventManager.broadcast('controlpointInfoListModification');
      this.activeModal.close();
    });
  }
}
