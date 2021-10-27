import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as moment from 'moment';
import { DATE_TIME_FORMAT } from 'app/shared/constants/input.constants';

import { IResultCourse, ResultCourse } from 'app/shared/model/result-course.model';
import { ResultCourseService } from './result-course.service';
import { IResultAdditionalInfo } from 'app/shared/model/result-additional-info.model';
import { ResultAdditionalInfoService } from 'app/entities/result-additional-info/result-additional-info.service';
import { ISharedCourse } from 'app/shared/model/shared-course.model';
import { SharedCourseService } from 'app/entities/shared-course/shared-course.service';

type SelectableEntity = IResultAdditionalInfo | ISharedCourse;

@Component({
  selector: 'jhi-result-course-update',
  templateUrl: './result-course-update.component.html',
})
export class ResultCourseUpdateComponent implements OnInit {
  isSaving = false;
  resultadditionalinfos: IResultAdditionalInfo[] = [];
  sharedcourses: ISharedCourse[] = [];

  editForm = this.fb.group({
    id: [],
    nickName: [],
    timeStampFinished: [],
    timeStampStarted: [],
    totalDurationInMillis: [],
    viewCode: [],
    showPositionCounter: [],
    switchAppCounter: [],
    resultAdditionalinfo: [],
    sharedCourse: [null, Validators.required],
  });

  constructor(
    protected resultCourseService: ResultCourseService,
    protected resultAdditionalInfoService: ResultAdditionalInfoService,
    protected sharedCourseService: SharedCourseService,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ resultCourse }) => {
      if (!resultCourse.id) {
        const today = moment().startOf('day');
        resultCourse.timeStampFinished = today;
        resultCourse.timeStampStarted = today;
      }

      this.updateForm(resultCourse);

      this.resultAdditionalInfoService
        .query({ filter: 'resultcourse-is-null' })
        .pipe(
          map((res: HttpResponse<IResultAdditionalInfo[]>) => {
            return res.body || [];
          })
        )
        .subscribe((resBody: IResultAdditionalInfo[]) => {
          if (!resultCourse.resultAdditionalinfo || !resultCourse.resultAdditionalinfo.id) {
            this.resultadditionalinfos = resBody;
          } else {
            this.resultAdditionalInfoService
              .find(resultCourse.resultAdditionalinfo.id)
              .pipe(
                map((subRes: HttpResponse<IResultAdditionalInfo>) => {
                  return subRes.body ? [subRes.body].concat(resBody) : resBody;
                })
              )
              .subscribe((concatRes: IResultAdditionalInfo[]) => (this.resultadditionalinfos = concatRes));
          }
        });

      this.sharedCourseService.query().subscribe((res: HttpResponse<ISharedCourse[]>) => (this.sharedcourses = res.body || []));
    });
  }

  updateForm(resultCourse: IResultCourse): void {
    this.editForm.patchValue({
      id: resultCourse.id,
      nickName: resultCourse.nickName,
      timeStampFinished: resultCourse.timeStampFinished ? resultCourse.timeStampFinished.format(DATE_TIME_FORMAT) : null,
      timeStampStarted: resultCourse.timeStampStarted ? resultCourse.timeStampStarted.format(DATE_TIME_FORMAT) : null,
      totalDurationInMillis: resultCourse.totalDurationInMillis,
      viewCode: resultCourse.viewCode,
      showPositionCounter: resultCourse.showPositionCounter,
      switchAppCounter: resultCourse.switchAppCounter,
      resultAdditionalinfo: resultCourse.resultAdditionalinfo,
      sharedCourse: resultCourse.sharedCourse,
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const resultCourse = this.createFromForm();
    if (resultCourse.id !== undefined) {
      this.subscribeToSaveResponse(this.resultCourseService.update(resultCourse));
    } else {
      this.subscribeToSaveResponse(this.resultCourseService.create(resultCourse));
    }
  }

  private createFromForm(): IResultCourse {
    return {
      ...new ResultCourse(),
      id: this.editForm.get(['id'])!.value,
      nickName: this.editForm.get(['nickName'])!.value,
      timeStampFinished: this.editForm.get(['timeStampFinished'])!.value
        ? moment(this.editForm.get(['timeStampFinished'])!.value, DATE_TIME_FORMAT)
        : undefined,
      timeStampStarted: this.editForm.get(['timeStampStarted'])!.value
        ? moment(this.editForm.get(['timeStampStarted'])!.value, DATE_TIME_FORMAT)
        : undefined,
      totalDurationInMillis: this.editForm.get(['totalDurationInMillis'])!.value,
      viewCode: this.editForm.get(['viewCode'])!.value,
      showPositionCounter: this.editForm.get(['showPositionCounter'])!.value,
      switchAppCounter: this.editForm.get(['switchAppCounter'])!.value,
      resultAdditionalinfo: this.editForm.get(['resultAdditionalinfo'])!.value,
      sharedCourse: this.editForm.get(['sharedCourse'])!.value,
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IResultCourse>>): void {
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

  trackById(index: number, item: SelectableEntity): any {
    return item.id;
  }
}
