import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IResultControlpoint } from 'app/shared/model/result-controlpoint.model';

@Component({
  selector: 'jhi-result-controlpoint-detail',
  templateUrl: './result-controlpoint-detail.component.html',
})
export class ResultControlpointDetailComponent implements OnInit {
  resultControlpoint: IResultControlpoint | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ resultControlpoint }) => (this.resultControlpoint = resultControlpoint));
  }

  previousState(): void {
    window.history.back();
  }
}
