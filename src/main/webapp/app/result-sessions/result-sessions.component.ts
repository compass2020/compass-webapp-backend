import { Component, OnInit } from '@angular/core';
import { FeedbackService } from 'app/feedback.service';
import { ToastrService } from 'ngx-toastr';
import { SharedCourseService } from 'app/entities/shared-course/shared-course.service';
import { Router } from '@angular/router';
import { JhiLanguageService } from 'ng-jhipster';
import { ISharedCourse } from 'app/shared/model/shared-course.model';
import { HttpResponse } from '@angular/common/http';
import { ICourse } from 'app/shared/model/course.model';
import { CourseService } from 'app/entities/course/course.service';

export interface DisplaySession {
  sharedCourse: ISharedCourse;
  selected: boolean;
}

@Component({
  selector: 'jhi-result-sessions',
  templateUrl: './result-sessions.component.html',
  styleUrls: ['result-sessions.component.scss'],
})
export class ResultSessionsComponent implements OnInit {
  sharedCourses: ISharedCourse[];
  displayedSessions: DisplaySession[];
  allDisplayedSessions: DisplaySession[];
  courseImgs: String[];
  courses: ICourse[];
  selectMany = false;
  selectedCourse = undefined;
  orderBy = 'date';
  orderAsc = false;
  itemsPerPage = '5';
  page = 1;

  constructor(
    public feedbackService: FeedbackService,
    private toastr: ToastrService,
    private sharedCourseService: SharedCourseService,
    private courseService: CourseService,
    private router: Router,
    public jhiTranslateLanguage: JhiLanguageService
  ) {}

  ngOnInit(): void {
    this.feedbackService.resultIDs = [];
    this.courses = [];
    this.courseImgs = [];
    this.displayedSessions = [];

    this.sharedCourseService.getMySharedCourses().subscribe((res: HttpResponse<ISharedCourse[]>) => {
      if (res.body !== undefined) {
        this.sharedCourses = res.body;
        this.courseImgs = [];
        this.reArrangeData();
        this.sharedCourses.forEach(element => {
          this.displayedSessions.push({ sharedCourse: element, selected: false });
          this.dropSessionsWithoutResults(this.displayedSessions);
          this.allDisplayedSessions = this.displayedSessions;
        });
      }
    });
  }

  dropSessionsWithoutResults(sessions: DisplaySession[]): void {
    for (let i = sessions.length - 1; i >= 0; i--) {
      if (sessions[i].sharedCourse.resultCourses.length === 0) {
        sessions.splice(i, 1);
      }
    }
  }

  reArrangeData(): void {
    this.sharedCourses.sort((a, b) => (a.timeStampShared < b.timeStampShared ? 1 : -1));
    const courseIDs = [];
    for (let i = 0; i < this.sharedCourses.length; i++) {
      if (!courseIDs.includes(this.sharedCourses[i].course.id)) courseIDs.push(this.sharedCourses[i].course.id);
    }

    this.courseService.getMyCourses().subscribe((res: HttpResponse<ICourse[]>) => {
      if (res.body !== undefined) {
        this.courses = res.body;
        this.mapCoursesToSharedCourses();
      }
    });
  }

  mapCoursesToSharedCourses(): void {
    for (let i = 0; i < this.sharedCourses.length; i++) {
      for (let j = 0; j < this.courses.length; j++) {
        if (this.sharedCourses[i].course.id === this.courses[j].id) {
          this.sharedCourses[i].course = this.courses[j];
          this.courseImgs[i] = 'data:' + this.courses[j].mapFinalSmallContentType + ';base64,' + this.courses[j].mapFinalSmall;
        }
      }
    }
  }

  selectCourse(course: ICourse): void {
    this.selectedCourse = course.id;
    this.displayedSessions = [];
    for (let i = 0; i < this.sharedCourses.length; i++) {
      if (this.sharedCourses[i].course.id === this.selectedCourse)
        this.displayedSessions.push({ sharedCourse: this.sharedCourses[i], selected: false });
    }
    this.dropSessionsWithoutResults(this.displayedSessions);
    this.allDisplayedSessions = this.displayedSessions;
  }

  sessionClick(sharedCourse: ISharedCourse): void {
    if (!this.selectMany) {
      this.showFeedback(sharedCourse);
    } else {
      this.displayedSessions.forEach(session => {
        if (session.sharedCourse === sharedCourse) session.selected = !session.selected;
      });
      this.dropSessionsWithoutResults(this.displayedSessions);
      this.allDisplayedSessions = this.displayedSessions;
    }
  }

  showSelectedSessions(): void {
    this.feedbackService.reset();
    for (let i = 0; i < this.displayedSessions.length; i++) {
      if (this.displayedSessions[i].selected) {
        for (let j = 0; j < this.displayedSessions[i].sharedCourse.resultCourses.length; j++) {
          this.feedbackService.addCourse(this.displayedSessions[i].sharedCourse.course.id);
          this.feedbackService.addResult(this.displayedSessions[i].sharedCourse.resultCourses[j].id);
        }
      }
    }

    if (this.feedbackService.resultIDs.length > 0) this.router.navigate(['feedback']);
    else {
      this.toastr.warning('Select runs to compare', 'Error', {
        positionClass: 'toast-top-center',
        timeOut: 5000,
      });
    }
  }

  toggleMultiple(): void {
    this.selectMany = !this.selectMany;
    if (this.selectMany === false) {
      this.displayedSessions = [];
      this.sharedCourses.forEach(session => {
        this.displayedSessions.push({ sharedCourse: session, selected: false });
      });
      this.selectedCourse = undefined;
      this.dropSessionsWithoutResults(this.displayedSessions);
      this.allDisplayedSessions = this.displayedSessions;
    }
  }

  showFeedback(sharedCourse: ISharedCourse): void {
    this.feedbackService.reset();
    for (let i = 0; i < sharedCourse.resultCourses.length; i++) {
      this.feedbackService.addCourse(sharedCourse.course.id);
      this.feedbackService.addResult(sharedCourse.resultCourses[i].id);
    }

    if (this.feedbackService.resultIDs.length > 0) this.router.navigate(['feedback']);
    else {
      this.toastr.warning('Select runs to compare', 'Error', {
        positionClass: 'toast-top-center',
        timeOut: 5000,
      });
    }
  }

  orderData(): void {
    switch (this.orderBy) {
      case 'date': {
        this.displayedSessions.sort((a, b) => {
          return this.compare(a.sharedCourse.timeStampShared.valueOf(), b.sharedCourse.timeStampShared.valueOf(), this.orderAsc);
        });
        break;
      }
      case 'athletes': {
        this.displayedSessions.sort((a, b) => {
          return this.compare(a.sharedCourse.resultCourses.length, b.sharedCourse.resultCourses.length, this.orderAsc);
        });
        break;
      }
      case 'sessionName': {
        this.displayedSessions.sort((a, b) => {
          return this.compare(a.sharedCourse.name.toLowerCase(), b.sharedCourse.name.toLowerCase(), this.orderAsc);
        });
        break;
      }
      case 'courseName': {
        this.displayedSessions.sort((a, b) => {
          return this.compare(a.sharedCourse.course.name.toLowerCase(), b.sharedCourse.course.name.toLowerCase(), this.orderAsc);
        });
        break;
      }
      case 'gameMode': {
        this.displayedSessions.sort((a, b) => {
          return this.compare(a.sharedCourse.gameModus, b.sharedCourse.gameModus, this.orderAsc);
        });
        break;
      }
    }
  }

  compare(a: number | string, b: number | string, isAsc: boolean): number {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }

  onSearchChange(): void {
    const text = (document.getElementById('searchbox') as HTMLInputElement).value.toLowerCase();
    this.displayedSessions = this.allDisplayedSessions.filter(session => {
      return session.sharedCourse.name.toLowerCase().includes(text) || session.sharedCourse.course.name.toLowerCase().includes(text);
    });
    this.orderData();
  }
}
