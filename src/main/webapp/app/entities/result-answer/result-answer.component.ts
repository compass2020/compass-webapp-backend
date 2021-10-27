import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IResultAnswer } from 'app/shared/model/result-answer.model';
import { ResultAnswerService } from './result-answer.service';
import { ResultAnswerDeleteDialogComponent } from './result-answer-delete-dialog.component';

@Component({
  selector: 'jhi-result-answer',
  templateUrl: './result-answer.component.html',
})
export class ResultAnswerComponent implements OnInit, OnDestroy {
  resultAnswers?: IResultAnswer[];
  eventSubscriber?: Subscription;

  constructor(
    protected resultAnswerService: ResultAnswerService,
    protected eventManager: JhiEventManager,
    protected modalService: NgbModal
  ) {}

  loadAll(): void {
    this.resultAnswerService.query().subscribe((res: HttpResponse<IResultAnswer[]>) => (this.resultAnswers = res.body || []));
  }

  ngOnInit(): void {
    this.loadAll();
    this.registerChangeInResultAnswers();
  }

  ngOnDestroy(): void {
    if (this.eventSubscriber) {
      this.eventManager.destroy(this.eventSubscriber);
    }
  }

  trackId(index: number, item: IResultAnswer): number {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    return item.id!;
  }

  registerChangeInResultAnswers(): void {
    this.eventSubscriber = this.eventManager.subscribe('resultAnswerListModification', () => this.loadAll());
  }

  delete(resultAnswer: IResultAnswer): void {
    const modalRef = this.modalService.open(ResultAnswerDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.resultAnswer = resultAnswer;
  }
}
