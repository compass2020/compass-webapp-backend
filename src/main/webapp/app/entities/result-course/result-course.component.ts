import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IResultCourse } from 'app/shared/model/result-course.model';
import { ResultCourseService } from './result-course.service';
import { ResultCourseDeleteDialogComponent } from './result-course-delete-dialog.component';

@Component({
  selector: 'jhi-result-course',
  templateUrl: './result-course.component.html',
})
export class ResultCourseComponent implements OnInit, OnDestroy {
  resultCourses?: IResultCourse[];
  eventSubscriber?: Subscription;

  constructor(
    protected resultCourseService: ResultCourseService,
    protected eventManager: JhiEventManager,
    protected modalService: NgbModal
  ) {}

  loadAll(): void {
    this.resultCourseService.query().subscribe((res: HttpResponse<IResultCourse[]>) => (this.resultCourses = res.body || []));
  }

  ngOnInit(): void {
    this.loadAll();
    this.registerChangeInResultCourses();
  }

  ngOnDestroy(): void {
    if (this.eventSubscriber) {
      this.eventManager.destroy(this.eventSubscriber);
    }
  }

  trackId(index: number, item: IResultCourse): number {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    return item.id!;
  }

  registerChangeInResultCourses(): void {
    this.eventSubscriber = this.eventManager.subscribe('resultCourseListModification', () => this.loadAll());
  }

  delete(resultCourse: IResultCourse): void {
    const modalRef = this.modalService.open(ResultCourseDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.resultCourse = resultCourse;
  }
}
