import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { DATE_TIME_FORMAT } from 'app/shared/constants/input.constants';

import { ISharedCourseQrCode, SharedCourseQrCode } from 'app/shared/model/shared-course-qr-code.model';
import { SharedCourseQrCodeService } from './shared-course-qr-code.service';
import { ISharedCourse } from 'app/shared/model/shared-course.model';
import { SharedCourseService } from 'app/entities/shared-course/shared-course.service';

@Component({
  selector: 'jhi-shared-course-qr-code-update',
  templateUrl: './shared-course-qr-code-update.component.html',
})
export class SharedCourseQrCodeUpdateComponent implements OnInit {
  isSaving = false;
  sharedcourses: ISharedCourse[] = [];

  editForm = this.fb.group({
    id: [],
    device: [],
    qrCode: [],
    scanned: [],
    timeStampScanned: [],
    sharedCourse: [null, Validators.required],
  });

  constructor(
    protected sharedCourseQrCodeService: SharedCourseQrCodeService,
    protected sharedCourseService: SharedCourseService,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ sharedCourseQrCode }) => {
      if (!sharedCourseQrCode.id) {
        const today = moment().startOf('day');
        sharedCourseQrCode.timeStampScanned = today;
      }

      this.updateForm(sharedCourseQrCode);

      this.sharedCourseService.query().subscribe((res: HttpResponse<ISharedCourse[]>) => (this.sharedcourses = res.body || []));
    });
  }

  updateForm(sharedCourseQrCode: ISharedCourseQrCode): void {
    this.editForm.patchValue({
      id: sharedCourseQrCode.id,
      device: sharedCourseQrCode.device,
      qrCode: sharedCourseQrCode.qrCode,
      scanned: sharedCourseQrCode.scanned,
      timeStampScanned: sharedCourseQrCode.timeStampScanned ? sharedCourseQrCode.timeStampScanned.format(DATE_TIME_FORMAT) : null,
      sharedCourse: sharedCourseQrCode.sharedCourse,
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const sharedCourseQrCode = this.createFromForm();
    if (sharedCourseQrCode.id !== undefined) {
      this.subscribeToSaveResponse(this.sharedCourseQrCodeService.update(sharedCourseQrCode));
    } else {
      this.subscribeToSaveResponse(this.sharedCourseQrCodeService.create(sharedCourseQrCode));
    }
  }

  private createFromForm(): ISharedCourseQrCode {
    return {
      ...new SharedCourseQrCode(),
      id: this.editForm.get(['id'])!.value,
      device: this.editForm.get(['device'])!.value,
      qrCode: this.editForm.get(['qrCode'])!.value,
      scanned: this.editForm.get(['scanned'])!.value,
      timeStampScanned: this.editForm.get(['timeStampScanned'])!.value
        ? moment(this.editForm.get(['timeStampScanned'])!.value, DATE_TIME_FORMAT)
        : undefined,
      sharedCourse: this.editForm.get(['sharedCourse'])!.value,
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ISharedCourseQrCode>>): void {
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

  trackById(index: number, item: ISharedCourse): any {
    return item.id;
  }
}
