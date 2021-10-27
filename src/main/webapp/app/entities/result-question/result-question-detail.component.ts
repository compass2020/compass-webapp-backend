import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IResultQuestion } from 'app/shared/model/result-question.model';

@Component({
  selector: 'jhi-result-question-detail',
  templateUrl: './result-question-detail.component.html',
})
export class ResultQuestionDetailComponent implements OnInit {
  resultQuestion: IResultQuestion | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ resultQuestion }) => (this.resultQuestion = resultQuestion));
  }

  previousState(): void {
    window.history.back();
  }
}
