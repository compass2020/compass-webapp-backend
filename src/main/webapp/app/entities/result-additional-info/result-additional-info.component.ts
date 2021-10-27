import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { JhiEventManager, JhiDataUtils } from 'ng-jhipster';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IResultAdditionalInfo } from 'app/shared/model/result-additional-info.model';
import { ResultAdditionalInfoService } from './result-additional-info.service';
import { ResultAdditionalInfoDeleteDialogComponent } from './result-additional-info-delete-dialog.component';

@Component({
  selector: 'jhi-result-additional-info',
  templateUrl: './result-additional-info.component.html',
})
export class ResultAdditionalInfoComponent implements OnInit, OnDestroy {
  resultAdditionalInfos?: IResultAdditionalInfo[];
  eventSubscriber?: Subscription;

  constructor(
    protected resultAdditionalInfoService: ResultAdditionalInfoService,
    protected dataUtils: JhiDataUtils,
    protected eventManager: JhiEventManager,
    protected modalService: NgbModal
  ) {}

  loadAll(): void {
    this.resultAdditionalInfoService
      .query()
      .subscribe((res: HttpResponse<IResultAdditionalInfo[]>) => (this.resultAdditionalInfos = res.body || []));
  }

  ngOnInit(): void {
    this.loadAll();
    this.registerChangeInResultAdditionalInfos();
  }

  ngOnDestroy(): void {
    if (this.eventSubscriber) {
      this.eventManager.destroy(this.eventSubscriber);
    }
  }

  trackId(index: number, item: IResultAdditionalInfo): number {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    return item.id!;
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(contentType = '', base64String: string): void {
    return this.dataUtils.openFile(contentType, base64String);
  }

  registerChangeInResultAdditionalInfos(): void {
    this.eventSubscriber = this.eventManager.subscribe('resultAdditionalInfoListModification', () => this.loadAll());
  }

  delete(resultAdditionalInfo: IResultAdditionalInfo): void {
    const modalRef = this.modalService.open(ResultAdditionalInfoDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.resultAdditionalInfo = resultAdditionalInfo;
  }
}
