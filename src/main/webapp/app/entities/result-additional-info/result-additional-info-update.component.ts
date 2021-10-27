import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { JhiDataUtils, JhiFileLoadError, JhiEventManager, JhiEventWithContent } from 'ng-jhipster';

import { IResultAdditionalInfo, ResultAdditionalInfo } from 'app/shared/model/result-additional-info.model';
import { ResultAdditionalInfoService } from './result-additional-info.service';
import { AlertError } from 'app/shared/alert/alert-error.model';

@Component({
  selector: 'jhi-result-additional-info-update',
  templateUrl: './result-additional-info-update.component.html',
})
export class ResultAdditionalInfoUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    gpxTrack: [],
    gpxTrackContentType: [],
    heartRate: [],
    heartRateContentType: [],
  });

  constructor(
    protected dataUtils: JhiDataUtils,
    protected eventManager: JhiEventManager,
    protected resultAdditionalInfoService: ResultAdditionalInfoService,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ resultAdditionalInfo }) => {
      this.updateForm(resultAdditionalInfo);
    });
  }

  updateForm(resultAdditionalInfo: IResultAdditionalInfo): void {
    this.editForm.patchValue({
      id: resultAdditionalInfo.id,
      gpxTrack: resultAdditionalInfo.gpxTrack,
      gpxTrackContentType: resultAdditionalInfo.gpxTrackContentType,
      heartRate: resultAdditionalInfo.heartRate,
      heartRateContentType: resultAdditionalInfo.heartRateContentType,
    });
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(contentType: string, base64String: string): void {
    this.dataUtils.openFile(contentType, base64String);
  }

  setFileData(event: Event, field: string, isImage: boolean): void {
    this.dataUtils.loadFileToForm(event, this.editForm, field, isImage).subscribe(null, (err: JhiFileLoadError) => {
      this.eventManager.broadcast(
        new JhiEventWithContent<AlertError>('compassApp.error', { ...err, key: 'error.file.' + err.key })
      );
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const resultAdditionalInfo = this.createFromForm();
    if (resultAdditionalInfo.id !== undefined) {
      this.subscribeToSaveResponse(this.resultAdditionalInfoService.update(resultAdditionalInfo));
    } else {
      this.subscribeToSaveResponse(this.resultAdditionalInfoService.create(resultAdditionalInfo));
    }
  }

  private createFromForm(): IResultAdditionalInfo {
    return {
      ...new ResultAdditionalInfo(),
      id: this.editForm.get(['id'])!.value,
      gpxTrackContentType: this.editForm.get(['gpxTrackContentType'])!.value,
      gpxTrack: this.editForm.get(['gpxTrack'])!.value,
      heartRateContentType: this.editForm.get(['heartRateContentType'])!.value,
      heartRate: this.editForm.get(['heartRate'])!.value,
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IResultAdditionalInfo>>): void {
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
}
