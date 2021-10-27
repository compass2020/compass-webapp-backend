import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IResultAnswer } from 'app/shared/model/result-answer.model';

@Component({
  selector: 'jhi-result-answer-detail',
  templateUrl: './result-answer-detail.component.html',
})
export class ResultAnswerDetailComponent implements OnInit {
  resultAnswer: IResultAnswer | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ resultAnswer }) => (this.resultAnswer = resultAnswer));
  }

  previousState(): void {
    window.history.back();
  }
}
