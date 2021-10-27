import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IResultControlpoint } from 'app/shared/model/result-controlpoint.model';
import { ResultControlpointService } from './result-controlpoint.service';
import { ResultControlpointDeleteDialogComponent } from './result-controlpoint-delete-dialog.component';

@Component({
  selector: 'jhi-result-controlpoint',
  templateUrl: './result-controlpoint.component.html',
})
export class ResultControlpointComponent implements OnInit, OnDestroy {
  resultControlpoints?: IResultControlpoint[];
  eventSubscriber?: Subscription;

  constructor(
    protected resultControlpointService: ResultControlpointService,
    protected eventManager: JhiEventManager,
    protected modalService: NgbModal
  ) {}

  loadAll(): void {
    this.resultControlpointService
      .query()
      .subscribe((res: HttpResponse<IResultControlpoint[]>) => (this.resultControlpoints = res.body || []));
  }

  ngOnInit(): void {
    this.loadAll();
    this.registerChangeInResultControlpoints();
  }

  ngOnDestroy(): void {
    if (this.eventSubscriber) {
      this.eventManager.destroy(this.eventSubscriber);
    }
  }

  trackId(index: number, item: IResultControlpoint): number {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    return item.id!;
  }

  registerChangeInResultControlpoints(): void {
    this.eventSubscriber = this.eventManager.subscribe('resultControlpointListModification', () => this.loadAll());
  }

  delete(resultControlpoint: IResultControlpoint): void {
    const modalRef = this.modalService.open(ResultControlpointDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.resultControlpoint = resultControlpoint;
  }
}
