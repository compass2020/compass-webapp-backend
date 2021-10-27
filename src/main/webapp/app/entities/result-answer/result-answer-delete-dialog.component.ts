import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IResultAnswer } from 'app/shared/model/result-answer.model';
import { ResultAnswerService } from './result-answer.service';

@Component({
  templateUrl: './result-answer-delete-dialog.component.html',
})
export class ResultAnswerDeleteDialogComponent {
  resultAnswer?: IResultAnswer;

  constructor(
    protected resultAnswerService: ResultAnswerService,
    public activeModal: NgbActiveModal,
    protected eventManager: JhiEventManager
  ) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.resultAnswerService.delete(id).subscribe(() => {
      this.eventManager.broadcast('resultAnswerListModification');
      this.activeModal.close();
    });
  }
}
