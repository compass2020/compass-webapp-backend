import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { ISharedCourse } from 'app/shared/model/shared-course.model';
import { SharedCourseService } from './shared-course.service';

@Component({
  templateUrl: './shared-course-delete-dialog.component.html',
})
export class SharedCourseDeleteDialogComponent {
  sharedCourse?: ISharedCourse;

  constructor(
    protected sharedCourseService: SharedCourseService,
    public activeModal: NgbActiveModal,
    protected eventManager: JhiEventManager
  ) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.sharedCourseService.delete(id).subscribe(() => {
      this.eventManager.broadcast('sharedCourseListModification');
      this.activeModal.close();
    });
  }
}
