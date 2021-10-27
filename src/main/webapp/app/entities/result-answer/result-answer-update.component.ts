import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';

import { IResultAnswer, ResultAnswer } from 'app/shared/model/result-answer.model';
import { ResultAnswerService } from './result-answer.service';
import { IResultQuestion } from 'app/shared/model/result-question.model';
import { ResultQuestionService } from 'app/entities/result-question/result-question.service';

@Component({
  selector: 'jhi-result-answer-update',
  templateUrl: './result-answer-update.component.html',
})
export class ResultAnswerUpdateComponent implements OnInit {
  isSaving = false;
  resultquestions: IResultQuestion[] = [];

  editForm = this.fb.group({
    id: [],
    text: [null, [Validators.required]],
    correct: [null, [Validators.required]],
    answeredCorrectly: [],
    resultQuestion: [null, Validators.required],
  });

  constructor(
    protected resultAnswerService: ResultAnswerService,
    protected resultQuestionService: ResultQuestionService,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ resultAnswer }) => {
      this.updateForm(resultAnswer);

      this.resultQuestionService.query().subscribe((res: HttpResponse<IResultQuestion[]>) => (this.resultquestions = res.body || []));
    });
  }

  updateForm(resultAnswer: IResultAnswer): void {
    this.editForm.patchValue({
      id: resultAnswer.id,
      text: resultAnswer.text,
      correct: resultAnswer.correct,
      answeredCorrectly: resultAnswer.answeredCorrectly,
      resultQuestion: resultAnswer.resultQuestion,
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const resultAnswer = this.createFromForm();
    if (resultAnswer.id !== undefined) {
      this.subscribeToSaveResponse(this.resultAnswerService.update(resultAnswer));
    } else {
      this.subscribeToSaveResponse(this.resultAnswerService.create(resultAnswer));
    }
  }

  private createFromForm(): IResultAnswer {
    return {
      ...new ResultAnswer(),
      id: this.editForm.get(['id'])!.value,
      text: this.editForm.get(['text'])!.value,
      correct: this.editForm.get(['correct'])!.value,
      answeredCorrectly: this.editForm.get(['answeredCorrectly'])!.value,
      resultQuestion: this.editForm.get(['resultQuestion'])!.value,
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IResultAnswer>>): void {
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

  trackById(index: number, item: IResultQuestion): any {
    return item.id;
  }
}
