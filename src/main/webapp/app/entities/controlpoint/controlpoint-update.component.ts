import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';

import { IControlpoint, Controlpoint } from 'app/shared/model/controlpoint.model';
import { ControlpointService } from './controlpoint.service';
import { IQuestion } from 'app/shared/model/question.model';
import { QuestionService } from 'app/entities/question/question.service';
import { IControlpointInfo } from 'app/shared/model/controlpoint-info.model';
import { ControlpointInfoService } from 'app/entities/controlpoint-info/controlpoint-info.service';
import { ICourse } from 'app/shared/model/course.model';
import { CourseService } from 'app/entities/course/course.service';

type SelectableEntity = IQuestion | IControlpointInfo | ICourse;

type SelectableManyToManyEntity = IQuestion | IControlpointInfo;

@Component({
  selector: 'jhi-controlpoint-update',
  templateUrl: './controlpoint-update.component.html',
})
export class ControlpointUpdateComponent implements OnInit {
  isSaving = false;
  questions: IQuestion[] = [];
  controlpointinfos: IControlpointInfo[] = [];
  courses: ICourse[] = [];

  editForm = this.fb.group({
    id: [],
    sequence: [null, [Validators.required]],
    controlCode: [],
    latitude: [null, [Validators.required]],
    longitude: [null, [Validators.required]],
    elevation: [],
    radius: [null, [Validators.required]],
    skippable: [null, [Validators.required]],
    team: [null, [Validators.required]],
    qrCode: [],
    description: [],
    questions: [null, Validators.required],
    controlpointInfos: [null, Validators.required],
    course: [null, Validators.required],
  });

  constructor(
    protected controlpointService: ControlpointService,
    protected questionService: QuestionService,
    protected controlpointInfoService: ControlpointInfoService,
    protected courseService: CourseService,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ controlpoint }) => {
      this.updateForm(controlpoint);

      this.questionService.query().subscribe((res: HttpResponse<IQuestion[]>) => (this.questions = res.body || []));

      this.controlpointInfoService.query().subscribe((res: HttpResponse<IControlpointInfo[]>) => (this.controlpointinfos = res.body || []));

      this.courseService.query().subscribe((res: HttpResponse<ICourse[]>) => (this.courses = res.body || []));
    });
  }

  updateForm(controlpoint: IControlpoint): void {
    this.editForm.patchValue({
      id: controlpoint.id,
      sequence: controlpoint.sequence,
      controlCode: controlpoint.controlCode,
      latitude: controlpoint.latitude,
      longitude: controlpoint.longitude,
      elevation: controlpoint.elevation,
      radius: controlpoint.radius,
      skippable: controlpoint.skippable,
      team: controlpoint.team,
      qrCode: controlpoint.qrCode,
      description: controlpoint.description,
      questions: controlpoint.questions,
      controlpointInfos: controlpoint.controlpointInfos,
      course: controlpoint.course,
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const controlpoint = this.createFromForm();
    if (controlpoint.id !== undefined) {
      this.subscribeToSaveResponse(this.controlpointService.update(controlpoint));
    } else {
      this.subscribeToSaveResponse(this.controlpointService.create(controlpoint));
    }
  }

  private createFromForm(): IControlpoint {
    return {
      ...new Controlpoint(),
      id: this.editForm.get(['id'])!.value,
      sequence: this.editForm.get(['sequence'])!.value,
      controlCode: this.editForm.get(['controlCode'])!.value,
      latitude: this.editForm.get(['latitude'])!.value,
      longitude: this.editForm.get(['longitude'])!.value,
      elevation: this.editForm.get(['elevation'])!.value,
      radius: this.editForm.get(['radius'])!.value,
      skippable: this.editForm.get(['skippable'])!.value,
      team: this.editForm.get(['team'])!.value,
      qrCode: this.editForm.get(['qrCode'])!.value,
      description: this.editForm.get(['description'])!.value,
      questions: this.editForm.get(['questions'])!.value,
      controlpointInfos: this.editForm.get(['controlpointInfos'])!.value,
      course: this.editForm.get(['course'])!.value,
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IControlpoint>>): void {
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

  trackById(index: number, item: SelectableEntity): any {
    return item.id;
  }

  getSelected(selectedVals: SelectableManyToManyEntity[], option: SelectableManyToManyEntity): SelectableManyToManyEntity {
    if (selectedVals) {
      for (let i = 0; i < selectedVals.length; i++) {
        if (option.id === selectedVals[i].id) {
          return selectedVals[i];
        }
      }
    }
    return option;
  }
}
