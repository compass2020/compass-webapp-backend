import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';

import { IResultQuestion, ResultQuestion } from 'app/shared/model/result-question.model';
import { ResultQuestionService } from './result-question.service';
import { ICategory } from 'app/shared/model/category.model';
import { CategoryService } from 'app/entities/category/category.service';

@Component({
  selector: 'jhi-result-question-update',
  templateUrl: './result-question-update.component.html',
})
export class ResultQuestionUpdateComponent implements OnInit {
  isSaving = false;
  categories: ICategory[] = [];

  editForm = this.fb.group({
    id: [],
    text: [null, [Validators.required]],
    type: [null, [Validators.required]],
    difficulty: [null, [Validators.required]],
    answeredCorrectly: [],
    category: [null, Validators.required],
  });

  constructor(
    protected resultQuestionService: ResultQuestionService,
    protected categoryService: CategoryService,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ resultQuestion }) => {
      this.updateForm(resultQuestion);

      this.categoryService.query().subscribe((res: HttpResponse<ICategory[]>) => (this.categories = res.body || []));
    });
  }

  updateForm(resultQuestion: IResultQuestion): void {
    this.editForm.patchValue({
      id: resultQuestion.id,
      text: resultQuestion.text,
      type: resultQuestion.type,
      difficulty: resultQuestion.difficulty,
      answeredCorrectly: resultQuestion.answeredCorrectly,
      category: resultQuestion.category,
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const resultQuestion = this.createFromForm();
    if (resultQuestion.id !== undefined) {
      this.subscribeToSaveResponse(this.resultQuestionService.update(resultQuestion));
    } else {
      this.subscribeToSaveResponse(this.resultQuestionService.create(resultQuestion));
    }
  }

  private createFromForm(): IResultQuestion {
    return {
      ...new ResultQuestion(),
      id: this.editForm.get(['id'])!.value,
      text: this.editForm.get(['text'])!.value,
      type: this.editForm.get(['type'])!.value,
      difficulty: this.editForm.get(['difficulty'])!.value,
      answeredCorrectly: this.editForm.get(['answeredCorrectly'])!.value,
      category: this.editForm.get(['category'])!.value,
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IResultQuestion>>): void {
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

  trackById(index: number, item: ICategory): any {
    return item.id;
  }
}
