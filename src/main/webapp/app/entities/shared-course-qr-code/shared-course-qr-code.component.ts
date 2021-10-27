import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ISharedCourseQrCode } from 'app/shared/model/shared-course-qr-code.model';
import { SharedCourseQrCodeService } from './shared-course-qr-code.service';
import { SharedCourseQrCodeDeleteDialogComponent } from './shared-course-qr-code-delete-dialog.component';

@Component({
  selector: 'jhi-shared-course-qr-code',
  templateUrl: './shared-course-qr-code.component.html',
})
export class SharedCourseQrCodeComponent implements OnInit, OnDestroy {
  sharedCourseQrCodes?: ISharedCourseQrCode[];
  eventSubscriber?: Subscription;

  constructor(
    protected sharedCourseQrCodeService: SharedCourseQrCodeService,
    protected eventManager: JhiEventManager,
    protected modalService: NgbModal
  ) {}

  loadAll(): void {
    this.sharedCourseQrCodeService
      .query()
      .subscribe((res: HttpResponse<ISharedCourseQrCode[]>) => (this.sharedCourseQrCodes = res.body || []));
  }

  ngOnInit(): void {
    this.loadAll();
    this.registerChangeInSharedCourseQrCodes();
  }

  ngOnDestroy(): void {
    if (this.eventSubscriber) {
      this.eventManager.destroy(this.eventSubscriber);
    }
  }

  trackId(index: number, item: ISharedCourseQrCode): number {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    return item.id!;
  }

  registerChangeInSharedCourseQrCodes(): void {
    this.eventSubscriber = this.eventManager.subscribe('sharedCourseQrCodeListModification', () => this.loadAll());
  }

  delete(sharedCourseQrCode: ISharedCourseQrCode): void {
    const modalRef = this.modalService.open(SharedCourseQrCodeDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.sharedCourseQrCode = sharedCourseQrCode;
  }
}
