/* eslint-disable @typescript-eslint/no-this-alias */
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GameModus } from 'app/shared/model/enumerations/game-modus.model';
import { SharedCourse, ISharedCourse } from 'app/shared/model/shared-course.model';
import { SharedCourseService } from 'app/entities/shared-course/shared-course.service';
import { Observable } from 'rxjs';
import { HttpResponse } from '@angular/common/http';
import * as moment from 'moment';
import { JhiLanguageService } from 'ng-jhipster';
import { CourseService } from 'app/entities/course/course.service';
import { ICourse } from 'app/shared/model/course.model';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ShowQRComponent } from 'app/show-qr/show-qr.component';
import { DateTimeAdapter } from 'ng-pick-datetime';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { Location } from '@angular/common';

@Component({
  selector: 'jhi-share-qrcode',
  templateUrl: './share-qrcode.component.html',
  styleUrls: ['./share-qrcode.component.scss'],
})
export class ShareQrcodeComponent implements OnInit {
  @ViewChild('template') templateRef: TemplateRef<any>;
  oneTimeQRCodes = false;
  activeDateRange = false;
  amountOfOneTimeCodes = 5;
  dateTimeNow = new Date();
  timeRange = [new Date(), new Date()];
  showCourseBeforeStart = true;
  showPositionAllowed = true;
  sessionName: string;
  selectedMode!: GameModus;
  gameModes = GameModus;
  sharedCourse!: SharedCourse;
  public qrcodeData: string = undefined;
  courseID!: number;
  radiosDisabled = false;
  sharedCourses: SharedCourse[];
  courseImg: String;
  course: ICourse;
  modalRef: NgbModalRef;
  removeIndex = undefined;

  constructor(
    private route: ActivatedRoute,
    protected sharedCourseService: SharedCourseService,
    protected courseService: CourseService,
    public jhiTranslateLanguage: JhiLanguageService,
    private toastr: ToastrService,
    public translate: TranslateService,
    private modalService: NgbModal,
    private location: Location,
    dateTimeAdapter: DateTimeAdapter<any>
  ) {
    dateTimeAdapter.setLocale(this.jhiTranslateLanguage.currentLang);
  }

  ngOnInit(): void {
    this.courseID = +this.route.snapshot.paramMap.get('id');
    this.timeRange[1].setDate(this.timeRange[1].getDate() + 14);
    this.timeRange[1].setHours(23);
    this.timeRange[1].setMinutes(59);

    this.sharedCourseService.getAllSharedCoursesForCourseId(this.courseID).subscribe((res: HttpResponse<ISharedCourse[]>) => {
      // TODO Refactor! new API to get only sharedcourses of this course
      this.sharedCourses = res.body || [];
      this.sharedCourses.sort((a, b) => (a.timeStampShared < b.timeStampShared ? 1 : -1));
    });

    this.courseService.find(this.courseID).subscribe(
      (res: HttpResponse<ICourse>) => {
        this.course = res.body || undefined;
        if (this.course !== undefined) {
          this.courseImg = 'data:' + this.course.mapFinalSmallContentType + ';base64,' + this.course.mapFinalSmall;
        }
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

    moment.locale(this.jhiTranslateLanguage.currentLang);
    this.sessionName = 'Session from ' + moment().format('LLLL');

    // should check if this course is really owned by current user or if i is a direct url request
  }

  getAllGameModes(): Array<string> {
    return Object.keys(this.gameModes);
  }

  generateQR(): void {
    if (this.selectedMode !== undefined) {
      this.modalRef = this.modalService.open(this.templateRef);
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ISharedCourse>>): void {
    result.subscribe(
      res => this.onSaveSuccess(res),
      () => this.onSaveError()
    );
  }

  protected onSaveSuccess(response: HttpResponse<ISharedCourse>): void {
    this.sharedCourse = response.body;

    this.sharedCourse.course = this.course;

    this.sharedCourses.push(this.sharedCourse);
    this.sharedCourses.sort((a, b) => (a.timeStampShared < b.timeStampShared ? 1 : -1));

    const modalRef = this.modalService.open(ShowQRComponent);
    modalRef.componentInstance.sharedCourse = this.sharedCourse;
  }

  protected onSaveError(): void {
    this.toastr.error(this.translate.instant('error.general'), this.translate.instant('error.general'), {
      positionClass: 'toast-top-center',
      timeOut: 5000,
    });
  }

  reshare(index: number): void {
    const modalRef = this.modalService.open(ShowQRComponent);
    modalRef.componentInstance.sharedCourse = this.sharedCourses[index];
  }

  remove(index: number): void {
    this.sharedCourses[index].visible = false;
    this.removeIndex = index;
    this.subscribeToUpdateResponse(this.sharedCourseService.update(this.sharedCourses[index]));
  }

  protected subscribeToUpdateResponse(result: Observable<HttpResponse<ISharedCourse>>): void {
    result.subscribe(
      () => {
        this.sharedCourses.splice(this.removeIndex, 1);
      },
      () => {
        this.toastr.error(this.translate.instant('error.general'), this.translate.instant('error.general'), {
          positionClass: 'toast-top-center',
          timeOut: 5000,
        });
      }
    );
  }

  confirm(): void {
    this.sharedCourse = {};
    this.sharedCourse.name = this.sessionName;
    this.sharedCourse.showCourseBeforeStart = this.showCourseBeforeStart;
    this.sharedCourse.showPositionAllowed = this.showPositionAllowed;

    if (this.oneTimeQRCodes) this.sharedCourse.numberOfCustomQrCodes = this.amountOfOneTimeCodes;
    else this.sharedCourse.numberOfCustomQrCodes = 0;

    if (this.activeDateRange) {
      this.sharedCourse.timeStampStart = moment(this.timeRange[0]);
      this.sharedCourse.timeStampEnd = moment(this.timeRange[1]);
    } else {
      this.sharedCourse.timeStampStart = null;
      this.sharedCourse.timeStampEnd = null;
    }
    this.sharedCourse.timeStampShared = moment();
    this.sharedCourse.course = { id: this.courseID };
    this.sharedCourse.gameModus = this.selectedMode;

    this.subscribeToSaveResponse(this.sharedCourseService.create(this.sharedCourse));
    this.modalRef.close();
  }

  decline(): void {
    this.modalRef.close();
  }
}
