import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { DATE_TIME_FORMAT } from 'app/shared/constants/input.constants';

import { IResultControlpoint, ResultControlpoint } from 'app/shared/model/result-controlpoint.model';
import { ResultControlpointService } from './result-controlpoint.service';
import { IResultQuestion } from 'app/shared/model/result-question.model';
import { ResultQuestionService } from 'app/entities/result-question/result-question.service';
import { IResultCourse } from 'app/shared/model/result-course.model';
import { ResultCourseService } from 'app/entities/result-course/result-course.service';

type SelectableEntity = IResultQuestion | IResultCourse;

@Component({
  selector: 'jhi-result-controlpoint-update',
  templateUrl: './result-controlpoint-update.component.html',
})
export class ResultControlpointUpdateComponent implements OnInit {
  isSaving = false;
  resultquestions: IResultQuestion[] = [];
  resultcourses: IResultCourse[] = [];

  editForm = this.fb.group({
    id: [],
    sequence: [null, [Validators.required]],
    timeReached: [],
    latitude: [],
    longitude: [],
    skipAllowed: [],
    reached: [],
    borgScale: [],
    forceSkipped: [],
    resultQuestions: [null, Validators.required],
    resultCourse: [null, Validators.required],
  });

  constructor(
    protected resultControlpointService: ResultControlpointService,
    protected resultQuestionService: ResultQuestionService,
    protected resultCourseService: ResultCourseService,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ resultControlpoint }) => {
      if (!resultControlpoint.id) {
        const today = moment().startOf('day');
        resultControlpoint.timeReached = today;
      }

      this.updateForm(resultControlpoint);

      this.resultQuestionService.query().subscribe((res: HttpResponse<IResultQuestion[]>) => (this.resultquestions = res.body || []));

      this.resultCourseService.query().subscribe((res: HttpResponse<IResultCourse[]>) => (this.resultcourses = res.body || []));
    });
  }

  updateForm(resultControlpoint: IResultControlpoint): void {
    this.editForm.patchValue({
      id: resultControlpoint.id,
      sequence: resultControlpoint.sequence,
      timeReached: resultControlpoint.timeReached ? resultControlpoint.timeReached.format(DATE_TIME_FORMAT) : null,
      latitude: resultControlpoint.latitude,
      longitude: resultControlpoint.longitude,
      skipAllowed: resultControlpoint.skipAllowed,
      reached: resultControlpoint.reached,
      borgScale: resultControlpoint.borgScale,
      forceSkipped: resultControlpoint.forceSkipped,
      resultQuestions: resultControlpoint.resultQuestions,
      resultCourse: resultControlpoint.resultCourse,
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const resultControlpoint = this.createFromForm();
    if (resultControlpoint.id !== undefined) {
      this.subscribeToSaveResponse(this.resultControlpointService.update(resultControlpoint));
    } else {
      this.subscribeToSaveResponse(this.resultControlpointService.create(resultControlpoint));
    }
  }

  private createFromForm(): IResultControlpoint {
    return {
      ...new ResultControlpoint(),
      id: this.editForm.get(['id'])!.value,
      sequence: this.editForm.get(['sequence'])!.value,
      timeReached: this.editForm.get(['timeReached'])!.value
        ? moment(this.editForm.get(['timeReached'])!.value, DATE_TIME_FORMAT)
        : undefined,
      latitude: this.editForm.get(['latitude'])!.value,
      longitude: this.editForm.get(['longitude'])!.value,
      skipAllowed: this.editForm.get(['skipAllowed'])!.value,
      reached: this.editForm.get(['reached'])!.value,
      borgScale: this.editForm.get(['borgScale'])!.value,
      forceSkipped: this.editForm.get(['forceSkipped'])!.value,
      resultQuestions: this.editForm.get(['resultQuestions'])!.value,
      resultCourse: this.editForm.get(['resultCourse'])!.value,
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IResultControlpoint>>): void {
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

  getSelected(selectedVals: IResultQuestion[], option: IResultQuestion): IResultQuestion {
    if (selectedVals) {
      for (let i = 0; i < selectedVals.length; i++) {
        if (option.id === selectedVals[i].id) {
          return selectedVals[i];
        }
      }
    }
    return option;
  }
}
