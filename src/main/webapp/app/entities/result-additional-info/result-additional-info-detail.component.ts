import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { JhiDataUtils } from 'ng-jhipster';

import { IResultAdditionalInfo } from 'app/shared/model/result-additional-info.model';

@Component({
  selector: 'jhi-result-additional-info-detail',
  templateUrl: './result-additional-info-detail.component.html',
})
export class ResultAdditionalInfoDetailComponent implements OnInit {
  resultAdditionalInfo: IResultAdditionalInfo | null = null;

  constructor(protected dataUtils: JhiDataUtils, protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ resultAdditionalInfo }) => (this.resultAdditionalInfo = resultAdditionalInfo));
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
