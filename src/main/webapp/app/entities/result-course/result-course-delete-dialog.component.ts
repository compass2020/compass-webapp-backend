import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IResultCourse } from 'app/shared/model/result-course.model';
import { ResultCourseService } from './result-course.service';

@Component({
  templateUrl: './result-course-delete-dialog.component.html',
})
export class ResultCourseDeleteDialogComponent {
  resultCourse?: IResultCourse;

  constructor(
    protected resultCourseService: ResultCourseService,
    public activeModal: NgbActiveModal,
    protected eventManager: JhiEventManager
  ) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.resultCourseService.delete(id).subscribe(() => {
      this.eventManager.broadcast('resultCourseListModification');
      this.activeModal.close();
    });
  }
}
