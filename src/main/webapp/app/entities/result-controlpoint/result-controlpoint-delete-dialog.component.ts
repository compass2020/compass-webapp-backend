import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IResultControlpoint } from 'app/shared/model/result-controlpoint.model';
import { ResultControlpointService } from './result-controlpoint.service';

@Component({
  templateUrl: './result-controlpoint-delete-dialog.component.html',
})
export class ResultControlpointDeleteDialogComponent {
  resultControlpoint?: IResultControlpoint;

  constructor(
    protected resultControlpointService: ResultControlpointService,
    public activeModal: NgbActiveModal,
    protected eventManager: JhiEventManager
  ) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.resultControlpointService.delete(id).subscribe(() => {
      this.eventManager.broadcast('resultControlpointListModification');
      this.activeModal.close();
    });
  }
}
