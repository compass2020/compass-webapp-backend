import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { JhiDataUtils } from 'ng-jhipster';

import { IControlpointInfo } from 'app/shared/model/controlpoint-info.model';

@Component({
  selector: 'jhi-controlpoint-info-detail',
  templateUrl: './controlpoint-info-detail.component.html',
})
export class ControlpointInfoDetailComponent implements OnInit {
  controlpointInfo: IControlpointInfo | null = null;

  constructor(protected dataUtils: JhiDataUtils, protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ controlpointInfo }) => (this.controlpointInfo = controlpointInfo));
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(contentType = '', base64String: string): void {
    this.dataUtils.openFile(contentType, base64String);
  }

  previousState(): void {
    window.history.back();
  }
}
