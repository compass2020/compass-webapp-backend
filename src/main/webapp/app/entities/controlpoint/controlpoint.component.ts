import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IControlpoint } from 'app/shared/model/controlpoint.model';
import { ControlpointService } from './controlpoint.service';
import { ControlpointDeleteDialogComponent } from './controlpoint-delete-dialog.component';

@Component({
  selector: 'jhi-controlpoint',
  templateUrl: './controlpoint.component.html',
})
export class ControlpointComponent implements OnInit, OnDestroy {
  controlpoints?: IControlpoint[];
  eventSubscriber?: Subscription;

  constructor(
    protected controlpointService: ControlpointService,
    protected eventManager: JhiEventManager,
    protected modalService: NgbModal
  ) {}

  loadAll(): void {
    this.controlpointService.query().subscribe((res: HttpResponse<IControlpoint[]>) => (this.controlpoints = res.body || []));
  }

  ngOnInit(): void {
    this.loadAll();
    this.registerChangeInControlpoints();
  }

  ngOnDestroy(): void {
    if (this.eventSubscriber) {
      this.eventManager.destroy(this.eventSubscriber);
    }
  }

  trackId(index: number, item: IControlpoint): number {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    return item.id!;
  }

  registerChangeInControlpoints(): void {
    this.eventSubscriber = this.eventManager.subscribe('controlpointListModification', () => this.loadAll());
  }

  delete(controlpoint: IControlpoint): void {
    const modalRef = this.modalService.open(ControlpointDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.controlpoint = controlpoint;
  }
}
