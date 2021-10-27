import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IControlpoint } from 'app/shared/model/controlpoint.model';
import { ControlpointService } from './controlpoint.service';

@Component({
  templateUrl: './controlpoint-delete-dialog.component.html',
})
export class ControlpointDeleteDialogComponent {
  controlpoint?: IControlpoint;

  constructor(
    protected controlpointService: ControlpointService,
    public activeModal: NgbActiveModal,
    protected eventManager: JhiEventManager
  ) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.controlpointService.delete(id).subscribe(() => {
      this.eventManager.broadcast('controlpointListModification');
      this.activeModal.close();
    });
  }
}
