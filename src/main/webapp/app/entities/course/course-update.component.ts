import { Component, OnInit, ElementRef } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { JhiDataUtils, JhiFileLoadError, JhiEventManager, JhiEventWithContent } from 'ng-jhipster';

import { ICourse, Course } from 'app/shared/model/course.model';
import { CourseService } from './course.service';
import { AlertError } from 'app/shared/alert/alert-error.model';
import { IOrienteeringMap } from 'app/shared/model/orienteering-map.model';
import { OrienteeringMapService } from 'app/entities/orienteering-map/orienteering-map.service';

@Component({
  selector: 'jhi-course-update',
  templateUrl: './course-update.component.html',
})
export class CourseUpdateComponent implements OnInit {
  isSaving = false;
  orienteeringmaps: IOrienteeringMap[] = [];

  editForm = this.fb.group({
    id: [],
    name: [null, [Validators.required]],
    shared: [null, [Validators.required]],
    mapFinalSmall: [],
    mapFinalSmallContentType: [],
    location: [],
    altitudeUp: [],
    altitudeDown: [],
    length: [],
    orienteeringMap: [],
  });

  constructor(
    protected dataUtils: JhiDataUtils,
    protected eventManager: JhiEventManager,
    protected courseService: CourseService,
    protected orienteeringMapService: OrienteeringMapService,
    protected elementRef: ElementRef,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ course }) => {
      this.updateForm(course);

      this.orienteeringMapService
        .query({ filter: 'course-is-null' })
        .pipe(
          map((res: HttpResponse<IOrienteeringMap[]>) => {
            return res.body || [];
          })
        )
        .subscribe((resBody: IOrienteeringMap[]) => {
          if (!course.orienteeringMap || !course.orienteeringMap.id) {
            this.orienteeringmaps = resBody;
          } else {
            this.orienteeringMapService
              .find(course.orienteeringMap.id)
              .pipe(
                map((subRes: HttpResponse<IOrienteeringMap>) => {
                  return subRes.body ? [subRes.body].concat(resBody) : resBody;
                })
              )
              .subscribe((concatRes: IOrienteeringMap[]) => (this.orienteeringmaps = concatRes));
          }
        });
    });
  }

  updateForm(course: ICourse): void {
    this.editForm.patchValue({
      id: course.id,
      name: course.name,
      shared: course.shared,
      mapFinalSmall: course.mapFinalSmall,
      mapFinalSmallContentType: course.mapFinalSmallContentType,
      location: course.location,
      altitudeUp: course.altitudeUp,
      altitudeDown: course.altitudeDown,
      length: course.length,
      orienteeringMap: course.orienteeringMap,
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
    const course = this.createFromForm();
    if (course.id !== undefined) {
      this.subscribeToSaveResponse(this.courseService.update(course));
    } else {
      this.subscribeToSaveResponse(this.courseService.create(course));
    }
  }

  private createFromForm(): ICourse {
    return {
      ...new Course(),
      id: this.editForm.get(['id'])!.value,
      name: this.editForm.get(['name'])!.value,
      shared: this.editForm.get(['shared'])!.value,
      mapFinalSmallContentType: this.editForm.get(['mapFinalSmallContentType'])!.value,
      mapFinalSmall: this.editForm.get(['mapFinalSmall'])!.value,
      location: this.editForm.get(['location'])!.value,
      altitudeUp: this.editForm.get(['altitudeUp'])!.value,
      altitudeDown: this.editForm.get(['altitudeDown'])!.value,
      length: this.editForm.get(['length'])!.value,
      orienteeringMap: this.editForm.get(['orienteeringMap'])!.value,
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ICourse>>): void {
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

  trackById(index: number, item: IOrienteeringMap): any {
    return item.id;
  }
}
