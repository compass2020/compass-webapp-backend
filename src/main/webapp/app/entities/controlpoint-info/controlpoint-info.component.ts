import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { JhiEventManager, JhiDataUtils } from 'ng-jhipster';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IControlpointInfo } from 'app/shared/model/controlpoint-info.model';
import { ControlpointInfoService } from './controlpoint-info.service';
import { ControlpointInfoDeleteDialogComponent } from './controlpoint-info-delete-dialog.component';

@Component({
  selector: 'jhi-controlpoint-info',
  templateUrl: './controlpoint-info.component.html',
})
export class ControlpointInfoComponent implements OnInit, OnDestroy {
  controlpointInfos?: IControlpointInfo[];
  eventSubscriber?: Subscription;

  constructor(
    protected controlpointInfoService: ControlpointInfoService,
    protected dataUtils: JhiDataUtils,
    protected eventManager: JhiEventManager,
    protected modalService: NgbModal
  ) {}

  loadAll(): void {
    this.controlpointInfoService.query().subscribe((res: HttpResponse<IControlpointInfo[]>) => (this.controlpointInfos = res.body || []));
  }

  ngOnInit(): void {
    this.loadAll();
    this.registerChangeInControlpointInfos();
  }

  ngOnDestroy(): void {
    if (this.eventSubscriber) {
      this.eventManager.destroy(this.eventSubscriber);
    }
  }

  trackId(index: number, item: IControlpointInfo): number {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    return item.id!;
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(contentType = '', base64String: string): void {
    return this.dataUtils.openFile(contentType, base64String);
  }

  registerChangeInControlpointInfos(): void {
    this.eventSubscriber = this.eventManager.subscribe('controlpointInfoListModification', () => this.loadAll());
  }

  delete(controlpointInfo: IControlpointInfo): void {
    const modalRef = this.modalService.open(ControlpointInfoDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.controlpointInfo = controlpointInfo;
  }
}
