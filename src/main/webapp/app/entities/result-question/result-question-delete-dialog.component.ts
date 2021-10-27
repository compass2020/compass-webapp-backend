import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IResultQuestion } from 'app/shared/model/result-question.model';
import { ResultQuestionService } from './result-question.service';

@Component({
  templateUrl: './result-question-delete-dialog.component.html',
})
export class ResultQuestionDeleteDialogComponent {
  resultQuestion?: IResultQuestion;

  constructor(
    protected resultQuestionService: ResultQuestionService,
    public activeModal: NgbActiveModal,
    protected eventManager: JhiEventManager
  ) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.resultQuestionService.delete(id).subscribe(() => {
      this.eventManager.broadcast('resultQuestionListModification');
      this.activeModal.close();
    });
  }
}
