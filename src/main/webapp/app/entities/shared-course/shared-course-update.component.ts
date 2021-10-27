import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { DATE_TIME_FORMAT } from 'app/shared/constants/input.constants';

import { ISharedCourse, SharedCourse } from 'app/shared/model/shared-course.model';
import { SharedCourseService } from './shared-course.service';
import { ICourse } from 'app/shared/model/course.model';
import { CourseService } from 'app/entities/course/course.service';

@Component({
  selector: 'jhi-shared-course-update',
  templateUrl: './shared-course-update.component.html',
})
export class SharedCourseUpdateComponent implements OnInit {
  isSaving = false;
  courses: ICourse[] = [];

  editForm = this.fb.group({
    id: [],
    name: [],
    qrCode: [],
    gameModus: [null, [Validators.required]],
    timeStampShared: [],
    visible: [],
    timeStampStart: [],
    timeStampEnd: [],
    numberOfCustomQrCodes: [],
    showCourseBeforeStart: [],
    showPositionAllowed: [],
    course: [null, Validators.required],
  });

  constructor(
    protected sharedCourseService: SharedCourseService,
    protected courseService: CourseService,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ sharedCourse }) => {
      if (!sharedCourse.id) {
        const today = moment().startOf('day');
        sharedCourse.timeStampShared = today;
        sharedCourse.timeStampStart = today;
        sharedCourse.timeStampEnd = today;
      }

      this.updateForm(sharedCourse);

      this.courseService.query().subscribe((res: HttpResponse<ICourse[]>) => (this.courses = res.body || []));
    });
  }

  updateForm(sharedCourse: ISharedCourse): void {
    this.editForm.patchValue({
      id: sharedCourse.id,
      name: sharedCourse.name,
      qrCode: sharedCourse.qrCode,
      gameModus: sharedCourse.gameModus,
      timeStampShared: sharedCourse.timeStampShared ? sharedCourse.timeStampShared.format(DATE_TIME_FORMAT) : null,
      visible: sharedCourse.visible,
      timeStampStart: sharedCourse.timeStampStart ? sharedCourse.timeStampStart.format(DATE_TIME_FORMAT) : null,
      timeStampEnd: sharedCourse.timeStampEnd ? sharedCourse.timeStampEnd.format(DATE_TIME_FORMAT) : null,
      numberOfCustomQrCodes: sharedCourse.numberOfCustomQrCodes,
      showCourseBeforeStart: sharedCourse.showCourseBeforeStart,
      showPositionAllowed: sharedCourse.showPositionAllowed,
      course: sharedCourse.course,
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const sharedCourse = this.createFromForm();
    if (sharedCourse.id !== undefined) {
      this.subscribeToSaveResponse(this.sharedCourseService.update(sharedCourse));
    } else {
      this.subscribeToSaveResponse(this.sharedCourseService.create(sharedCourse));
    }
  }

  private createFromForm(): ISharedCourse {
    return {
      ...new SharedCourse(),
      id: this.editForm.get(['id'])!.value,
      name: this.editForm.get(['name'])!.value,
      qrCode: this.editForm.get(['qrCode'])!.value,
      gameModus: this.editForm.get(['gameModus'])!.value,
      timeStampShared: this.editForm.get(['timeStampShared'])!.value
        ? moment(this.editForm.get(['timeStampShared'])!.value, DATE_TIME_FORMAT)
        : undefined,
      visible: this.editForm.get(['visible'])!.value,
      timeStampStart: this.editForm.get(['timeStampStart'])!.value
        ? moment(this.editForm.get(['timeStampStart'])!.value, DATE_TIME_FORMAT)
        : undefined,
      timeStampEnd: this.editForm.get(['timeStampEnd'])!.value
        ? moment(this.editForm.get(['timeStampEnd'])!.value, DATE_TIME_FORMAT)
        : undefined,
      numberOfCustomQrCodes: this.editForm.get(['numberOfCustomQrCodes'])!.value,
      showCourseBeforeStart: this.editForm.get(['showCourseBeforeStart'])!.value,
      showPositionAllowed: this.editForm.get(['showPositionAllowed'])!.value,
      course: this.editForm.get(['course'])!.value,
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ISharedCourse>>): void {
    result.subscribe(
      () => this.onSaveSuccess(),
      () => this.onSaveError()
    );
  }

  protected onSaveSuccess(): void {
    this.isSaving = false;
    this.previousState();
  }

  protected onSaveError(): void {
    this.isSaving = false;
  }

  trackById(index: number, item: ICourse): any {
    return item.id;
  }
}
