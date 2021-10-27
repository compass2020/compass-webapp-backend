/* eslint-disable no-console */
import { Component, HostListener, Injectable, OnInit, ViewChild } from '@angular/core';
import { MapComponent } from 'app/map/map.component';
import { ControlpointDetailsComponent } from 'app/controlpoint-details/controlpoint-details.component';
import { Course, ICourse } from 'app/shared/model/course.model';
import { CourseService } from 'app/entities/course/course.service';
import { HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { MatButton } from '@angular/material/button';
import { CanDeactivate } from '@angular/router';
import { ControlpointInfoService } from 'app/entities/controlpoint-info/controlpoint-info.service';
import { IControlpointInfo } from 'app/shared/model/controlpoint-info.model';
import { Location } from '@angular/common';

@Injectable()
export class CanDeactivateGuard implements CanDeactivate<CreateCourseComponent> {
  canDeactivate(component: CreateCourseComponent): Observable<boolean> | boolean {
    if (!component.hasUnsavedData() || component.freshlySaved) {
      return true;
    } else {
      return confirm(component.translate.instant('create-course.confirmDataNotSaved'));
    }
  }
}

@Component({
  selector: 'jhi-create-course',
  templateUrl: './create-course.component.html',
  styleUrls: ['create-course.component.scss'],
})
export class CreateCourseComponent implements OnInit {
  @ViewChild(ControlpointDetailsComponent)
  childDetails!: ControlpointDetailsComponent;
  @ViewChild(MapComponent) childMap!: MapComponent;
  @ViewChild('saveButton') saveButton: MatButton;
  isSaving = false;
  freshlySaved = false;
  courseType = 0;
  allCPInfos: IControlpointInfo[];
  selectedCPInfos = [];
  expertMode = false;

  course!: Course;

  constructor(
    protected courseService: CourseService,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService,
    public translate: TranslateService,
    private location: Location,
    private controlpointInfoService: ControlpointInfoService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const id = params['id'];
      if (id !== undefined) {
        this.loadCourseFromDB(id);
      } else {
        this.course = { name: 'Orienteering Trail #' + this.getRandomInt(100) };
        this.course.orienteeringMap = {};
        this.course.controlpoints = [];
        if (this.childMap !== undefined) this.childMap.resetAllVariables();
      }
    });
    this.controlpointInfoService.query().subscribe((res: HttpResponse<IControlpointInfo[]>) => {
      this.allCPInfos = res.body || [];
      this.allCPInfos.sort((a, b) => {
        return a.sort > b.sort ? 1 : -1;
      });
    });
  }

  getRandomInt(max): number {
    return Math.floor(Math.random() * Math.floor(max));
  }

  onStepperChange(event: any): void {
    if (event.selectedIndex === 0) {
      this.childMap.paintControlpointsOnMap();
    }
    if (event.selectedIndex === 1) {
      if (this.course.controlpoints.length > 0) {
        this.convertOverlayStringsToObject();
        this.childDetails.initializeDetailMaps();
        this.childDetails.markSelectedControlpointInfos();
        this.childDetails.checkQuestionsForAssignment();
      }
    }
    if (event.selectedIndex === 2) {
      this.prepareCourseForSaving();
      this.arrangeControlpointInfos();
    }
  }

  saveCourseToDB(event: any): void {
    this.saveButton.disabled = true;
    if (this.course.controlpoints.length < 2) {
      this.toastr.error(this.translate.instant('create-course.atLeastTwoControlpoints'), this.translate.instant('error.general'), {
        positionClass: 'toast-top-center',
        timeOut: 5000,
      });
      this.saveButton.disabled = false;
    } else {
      this.childMap.downloadMap();
    }
    event.preventDefault();
  }

  save(): void {
    this.prepareCourseForSaving();
    if (this.course.id !== undefined) {
      this.subscribeToSaveResponse(this.courseService.update(this.course));
    } else {
      this.subscribeToSaveResponse(this.courseService.create(this.course));
    }
  }

  prepareCourseForSaving(): void {
    this.isSaving = true;
    this.course.location = '';
    /* this.course.length = this.childMap.courseLength; */
    /* this.course.altitudeUp = this.childMap.altitudeUp;
    this.course.altitudeDown = this.childMap.altitudeDown; */

    this.course.mapFinalSmall = this.childMap.mapFinalSmallBlob;
    this.course.mapFinalSmallContentType = 'image/jpeg';

    this.convertOverlayStringsToObject();

    this.course.orienteeringMap.declination = this.childMap.getDeclination();
  }

  protected convertOverlayStringsToObject(): void {
    if (this.childMap.overlayImgAsString !== undefined) {
      if (this.childMap.overlayImgAsString !== null) {
        const endOfContentType = this.childMap.overlayImgAsString.indexOf(';');
        const startOfDataBytes = this.childMap.overlayImgAsString.indexOf(',');
        this.course.orienteeringMap.mapOverlayImageContentType = this.childMap.overlayImgAsString.substr(5, endOfContentType - 5);
        this.course.orienteeringMap.mapOverlayImage = this.childMap.overlayImgAsString.substr(startOfDataBytes + 1);
      } else {
        this.course.orienteeringMap.mapOverlayImage = null;
        this.course.orienteeringMap.mapOverlayImageContentType = null;
      }
    }
    if (this.childMap.kmlString !== undefined && this.childMap.kmlString !== null) {
      const endOfContentType = this.childMap.kmlString.indexOf(';');
      const startOfDataBytes = this.childMap.kmlString.indexOf(',');
      this.course.orienteeringMap.mapOverlayKmlContentType = this.childMap.kmlString.substr(5, endOfContentType - 5);
      this.course.orienteeringMap.mapOverlayKml = this.childMap.kmlString.substr(startOfDataBytes + 1);
    } else {
      this.course.orienteeringMap.mapOverlayKml = null;
      this.course.orienteeringMap.mapOverlayKmlContentType = null;
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ICourse>>): void {
    result.subscribe(
      res => this.onSaveSuccess(res),
      () => this.onSaveError()
    );
  }

  protected onSaveSuccess(response: HttpResponse<ICourse>): void {
    this.isSaving = false;
    this.freshlySaved = true;
    this.course = response.body;
    this.router.navigate(['/my-courses']);
  }

  protected onSaveError(): void {
    this.isSaving = false;
    this.saveButton.disabled = false;
    this.toastr.error('', this.translate.instant('error.general'), {
      positionClass: 'toast-top-center',
      timeOut: 5000,
    });
  }

  loadCourseFromDB(id: number): void {
    this.course = {};
    this.course.orienteeringMap = {};
    this.courseService.find(id).subscribe(
      (res: HttpResponse<ICourse>) => {
        this.course = res.body || undefined;
        if (this.course !== undefined) this.fetchCourseAfterLoad();
      },
      error => {
        if (Math.floor(error.status / 100) === 4) {
          // access denied
          this.toastr.error(this.translate.instant('error.accessDeniedGoBack'), this.translate.instant('error.general'), {
            positionClass: 'toast-top-center',
            timeOut: 5000,
          });

          setTimeout(() => {
            this.location.back();
          }, 4000);
        }
      }
    );
  }

  fetchCourseAfterLoad(): void {
    if (this.course.shared) {
      this.toastr.info(this.translate.instant('create-course.msg-no-edit'), this.translate.instant('create-course.title-no-edit'), {
        positionClass: 'toast-top-center',
        timeOut: 10000,
      });
    }
    this.course.controlpoints.forEach(controlpoint => {
      if (controlpoint.questions === undefined) controlpoint.questions = [];
    });
    /*
    this.course.controlpoints = this.course.controlpoints;
    this.childMap.controlpoints = this.course.controlpoints; */

    this.course.controlpoints.sort((a, b) => (a.sequence > b.sequence ? 1 : -1));

    this.childMap.decliation = this.course.orienteeringMap.declination;

    this.arrangeControlpointInfos();

    this.childMap.course = this.course;

    if (this.course.orienteeringMap.mapOverlayKmlContentType !== null) {
      this.childMap.kmlString =
        'data:' + this.course.orienteeringMap.mapOverlayKmlContentType + ';base64,' + this.course.orienteeringMap.mapOverlayKml;
      this.childMap.addKMLtoMap();
    }

    if (this.course.orienteeringMap.mapOverlayImageContentType !== null) {
      this.childMap.overlayImgAsString =
        'data:' + this.course.orienteeringMap.mapOverlayImageContentType + ';base64,' + this.course.orienteeringMap.mapOverlayImage;
      this.childMap.createImgOverlay();
    }

    this.childMap.paintControlpointsOnMap();
    this.childMap.setAltitudeArr();
    this.childMap.drawAltitudeChart();
    this.childMap.fitMapToFeatures();
    this.childMap.setZoomLevelToMax();
  }

  arrangeControlpointInfos(): void {
    let tempColIndex;
    this.selectedCPInfos = [];
    let tempInfos;
    let nrOfInfosInserted;
    for (let i = 0; i < this.course.controlpoints?.length; i++) {
      tempInfos = [];
      nrOfInfosInserted = 0;
      for (let j = 0; j < this.course.controlpoints[i].controlpointInfos.length; j++) {
        tempColIndex = this.course.controlpoints[i].controlpointInfos[j].col.charCodeAt(0) - 67 - nrOfInfosInserted;
        for (let k = 0; k < tempColIndex; k++) {
          tempInfos.push('');
          nrOfInfosInserted++;
        }

        tempInfos.push(
          'data:' +
            this.course.controlpoints[i].controlpointInfos[j].imageContentType +
            ';base64,' +
            this.course.controlpoints[i].controlpointInfos[j].image
        );
        nrOfInfosInserted++;
      }
      for (let j = tempInfos.length; j < 6; j++) tempInfos.push('');
      this.selectedCPInfos.push(tempInfos);
    }
  }

  @HostListener('window:beforeunload', ['$event'])
  unloadNotification($event: any): void {
    if (this.hasUnsavedData()) {
      $event.returnValue = true;
    }
  }

  hasUnsavedData(): boolean {
    if (this.course.controlpoints.length > 0) return true;
    else return false;
  }
}
