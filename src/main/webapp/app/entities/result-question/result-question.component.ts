import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IResultQuestion } from 'app/shared/model/result-question.model';
import { ResultQuestionService } from './result-question.service';
import { ResultQuestionDeleteDialogComponent } from './result-question-delete-dialog.component';

@Component({
  selector: 'jhi-result-question',
  templateUrl: './result-question.component.html',
})
export class ResultQuestionComponent implements OnInit, OnDestroy {
  resultQuestions?: IResultQuestion[];
  eventSubscriber?: Subscription;

  constructor(
    protected resultQuestionService: ResultQuestionService,
    protected eventManager: JhiEventManager,
    protected modalService: NgbModal
  ) {}

  loadAll(): void {
    this.resultQuestionService.query().subscribe((res: HttpResponse<IResultQuestion[]>) => (this.resultQuestions = res.body || []));
  }

  ngOnInit(): void {
    this.loadAll();
    this.registerChangeInResultQuestions();
  }

  ngOnDestroy(): void {
    if (this.eventSubscriber) {
      this.eventManager.destroy(this.eventSubscriber);
    }
  }

  trackId(index: number, item: IResultQuestion): number {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    return item.id!;
  }

  registerChangeInResultQuestions(): void {
    this.eventSubscriber = this.eventManager.subscribe('resultQuestionListModification', () => this.loadAll());
  }

  delete(resultQuestion: IResultQuestion): void {
    const modalRef = this.modalService.open(ResultQuestionDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.resultQuestion = resultQuestion;
  }
}
