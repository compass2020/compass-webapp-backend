import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IResultAdditionalInfo } from 'app/shared/model/result-additional-info.model';
import { ResultAdditionalInfoService } from './result-additional-info.service';

@Component({
  templateUrl: './result-additional-info-delete-dialog.component.html',
})
export class ResultAdditionalInfoDeleteDialogComponent {
  resultAdditionalInfo?: IResultAdditionalInfo;

  constructor(
    protected resultAdditionalInfoService: ResultAdditionalInfoService,
    public activeModal: NgbActiveModal,
    protected eventManager: JhiEventManager
  ) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.resultAdditionalInfoService.delete(id).subscribe(() => {
      this.eventManager.broadcast('resultAdditionalInfoListModification');
      this.activeModal.close();
    });
  }
}
