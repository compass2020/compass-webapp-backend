import { Component, OnInit, ElementRef } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { JhiDataUtils, JhiFileLoadError, JhiEventManager, JhiEventWithContent } from 'ng-jhipster';

import { IOrienteeringMap, OrienteeringMap } from 'app/shared/model/orienteering-map.model';
import { OrienteeringMapService } from './orienteering-map.service';
import { AlertError } from 'app/shared/alert/alert-error.model';

@Component({
  selector: 'jhi-orienteering-map-update',
  templateUrl: './orienteering-map-update.component.html',
})
export class OrienteeringMapUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    mapOverlayImage: [],
    mapOverlayImageContentType: [],
    mapOverlayKml: [],
    mapOverlayKmlContentType: [],
    imageScaleX: [],
    imageScaleY: [],
    imageCenterX: [],
    imageCenterY: [],
    imageRotation: [],
    declination: [],
  });

  constructor(
    protected dataUtils: JhiDataUtils,
    protected eventManager: JhiEventManager,
    protected orienteeringMapService: OrienteeringMapService,
    protected elementRef: ElementRef,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ orienteeringMap }) => {
      this.updateForm(orienteeringMap);
    });
  }

  updateForm(orienteeringMap: IOrienteeringMap): void {
    this.editForm.patchValue({
      id: orienteeringMap.id,
      mapOverlayImage: orienteeringMap.mapOverlayImage,
      mapOverlayImageContentType: orienteeringMap.mapOverlayImageContentType,
      mapOverlayKml: orienteeringMap.mapOverlayKml,
      mapOverlayKmlContentType: orienteeringMap.mapOverlayKmlContentType,
      imageScaleX: orienteeringMap.imageScaleX,
      imageScaleY: orienteeringMap.imageScaleY,
      imageCenterX: orienteeringMap.imageCenterX,
      imageCenterY: orienteeringMap.imageCenterY,
      imageRotation: orienteeringMap.imageRotation,
      declination: orienteeringMap.declination,
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
    const orienteeringMap = this.createFromForm();
    if (orienteeringMap.id !== undefined) {
      this.subscribeToSaveResponse(this.orienteeringMapService.update(orienteeringMap));
    } else {
      this.subscribeToSaveResponse(this.orienteeringMapService.create(orienteeringMap));
    }
  }

  private createFromForm(): IOrienteeringMap {
    return {
      ...new OrienteeringMap(),
      id: this.editForm.get(['id'])!.value,
      mapOverlayImageContentType: this.editForm.get(['mapOverlayImageContentType'])!.value,
      mapOverlayImage: this.editForm.get(['mapOverlayImage'])!.value,
      mapOverlayKmlContentType: this.editForm.get(['mapOverlayKmlContentType'])!.value,
      mapOverlayKml: this.editForm.get(['mapOverlayKml'])!.value,
      imageScaleX: this.editForm.get(['imageScaleX'])!.value,
      imageScaleY: this.editForm.get(['imageScaleY'])!.value,
      imageCenterX: this.editForm.get(['imageCenterX'])!.value,
      imageCenterY: this.editForm.get(['imageCenterY'])!.value,
      imageRotation: this.editForm.get(['imageRotation'])!.value,
      declination: this.editForm.get(['declination'])!.value,
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IOrienteeringMap>>): void {
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
