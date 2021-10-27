import { Component, OnInit, ElementRef } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { JhiDataUtils, JhiFileLoadError, JhiEventManager, JhiEventWithContent } from 'ng-jhipster';

import { IControlpointInfo, ControlpointInfo } from 'app/shared/model/controlpoint-info.model';
import { ControlpointInfoService } from './controlpoint-info.service';
import { AlertError } from 'app/shared/alert/alert-error.model';

@Component({
  selector: 'jhi-controlpoint-info-update',
  templateUrl: './controlpoint-info-update.component.html',
})
export class ControlpointInfoUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    image: [null, [Validators.required]],
    imageContentType: [],
    col: [null, [Validators.required]],
    description: [null, [Validators.required]],
    messageKey: [null, [Validators.required]],
    sort: [null, [Validators.required]],
  });

  constructor(
    protected dataUtils: JhiDataUtils,
    protected eventManager: JhiEventManager,
    protected controlpointInfoService: ControlpointInfoService,
    protected elementRef: ElementRef,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ controlpointInfo }) => {
      this.updateForm(controlpointInfo);
    });
  }

  updateForm(controlpointInfo: IControlpointInfo): void {
    this.editForm.patchValue({
      id: controlpointInfo.id,
      image: controlpointInfo.image,
      imageContentType: controlpointInfo.imageContentType,
      col: controlpointInfo.col,
      description: controlpointInfo.description,
      messageKey: controlpointInfo.messageKey,
      sort: controlpointInfo.sort,
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

  clearInputImage(field: string, fieldContentType: string, idInput: string): void {
    this.editForm.patchValue({
      [field]: null,
      [fieldContentType]: null,
    });
    if (this.elementRef && idInput && this.elementRef.nativeElement.querySelector('#' + idInput)) {
      this.elementRef.nativeElement.querySelector('#' + idInput).value = null;
    }
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const controlpointInfo = this.createFromForm();
    if (controlpointInfo.id !== undefined) {
      this.subscribeToSaveResponse(this.controlpointInfoService.update(controlpointInfo));
    } else {
      this.subscribeToSaveResponse(this.controlpointInfoService.create(controlpointInfo));
    }
  }

  private createFromForm(): IControlpointInfo {
    return {
      ...new ControlpointInfo(),
      id: this.editForm.get(['id'])!.value,
      imageContentType: this.editForm.get(['imageContentType'])!.value,
      image: this.editForm.get(['image'])!.value,
      col: this.editForm.get(['col'])!.value,
      description: this.editForm.get(['description'])!.value,
      messageKey: this.editForm.get(['messageKey'])!.value,
      sort: this.editForm.get(['sort'])!.value,
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IControlpointInfo>>): void {
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
