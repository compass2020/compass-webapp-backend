import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IControlpoint } from 'app/shared/model/controlpoint.model';

@Component({
  selector: 'jhi-controlpoint-detail',
  templateUrl: './controlpoint-detail.component.html',
})
export class ControlpointDetailComponent implements OnInit {
  controlpoint: IControlpoint | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ controlpoint }) => (this.controlpoint = controlpoint));
  }

  previousState(): void {
    window.history.back();
  }
}
