import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ISharedCourse } from 'app/shared/model/shared-course.model';
import { SharedCourseService } from './shared-course.service';
import { SharedCourseDeleteDialogComponent } from './shared-course-delete-dialog.component';

@Component({
  selector: 'jhi-shared-course',
  templateUrl: './shared-course.component.html',
})
export class SharedCourseComponent implements OnInit, OnDestroy {
  sharedCourses?: ISharedCourse[];
  eventSubscriber?: Subscription;

  constructor(
    protected sharedCourseService: SharedCourseService,
    protected eventManager: JhiEventManager,
    protected modalService: NgbModal
  ) {}

  loadAll(): void {
    this.sharedCourseService.query().subscribe((res: HttpResponse<ISharedCourse[]>) => (this.sharedCourses = res.body || []));
  }

  ngOnInit(): void {
    this.loadAll();
    this.registerChangeInSharedCourses();
  }

  ngOnDestroy(): void {
    if (this.eventSubscriber) {
      this.eventManager.destroy(this.eventSubscriber);
    }
  }

  trackId(index: number, item: ISharedCourse): number {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    return item.id!;
  }

  registerChangeInSharedCourses(): void {
    this.eventSubscriber = this.eventManager.subscribe('sharedCourseListModification', () => this.loadAll());
  }

  delete(sharedCourse: ISharedCourse): void {
    const modalRef = this.modalService.open(SharedCourseDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.sharedCourse = sharedCourse;
  }
}
