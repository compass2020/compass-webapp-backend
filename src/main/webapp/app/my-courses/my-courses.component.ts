import { Component, OnInit } from '@angular/core';
import { CourseService } from 'app/entities/course/course.service';
import { HttpResponse } from '@angular/common/http';
import { ICourse, Course } from 'app/shared/model/course.model';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { GameModus } from 'app/shared/model/enumerations/game-modus.model';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { JhiLanguageService } from 'ng-jhipster';

@Component({
  selector: 'jhi-my-courses',
  templateUrl: './my-courses.component.html',
  styleUrls: ['my-courses.component.scss'],
})
export class MyCoursesComponent implements OnInit {
  message: string;
  courses!: Course[];
  allCourses!: Course[];
  modus!: String;
  selectedMode!: GameModus;
  orderBy = 'date';
  orderAsc = false;
  itemsPerPage = '5';
  page = 1;

  gameModes = GameModus;

  public qrcodeData: string = null;

  constructor(
    protected courseService: CourseService,
    private router: Router,
    private toastr: ToastrService,
    private translate: TranslateService,
    public jhiTranslateLanguage: JhiLanguageService
  ) {
    this.message = 'MyCoursesComponent message';
  }

  ngOnInit(): void {
    this.courseService.getMyCourses().subscribe((res: HttpResponse<ICourse[]>) => {
      this.courses = res.body || [];
      this.courses.reverse();
      this.allCourses = this.courses;
    });
  }

  getAllGameModes(): Array<string> {
    return Object.keys(this.gameModes);
  }

  viewCourse(courseID: number): void {
    this.router.navigate(['/create-course', courseID]);
  }

  deleteCourse(courseID: number): void {
    this.courseService.delete(courseID).subscribe(() => {
      for (let i = 0; i < this.courses.length; i++) {
        if (this.courses[i].id === courseID) this.courses.splice(i, 1);
      }
    });
  }

  duplicateCourse(index: number): void {
    this.courseService.find(this.courses[index].id).subscribe((res: HttpResponse<ICourse>) => {
      const newCourse = res.body || undefined;
      if (newCourse !== undefined) {
        newCourse.id = undefined;
        newCourse.shared = false;
        newCourse.name += '_COPY';
        newCourse.orienteeringMap.id = undefined;
        newCourse.controlpoints.forEach(controlpoint => {
          controlpoint.id = undefined;
        });
        this.subscribeToSaveResponse(this.courseService.create(newCourse));
      }
    });
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ICourse>>): void {
    result.subscribe(
      res => this.onSaveSuccess(res),
      () => this.onSaveError()
    );
  }

  protected onSaveSuccess(response: HttpResponse<ICourse>): void {
    this.courses.push(response.body);
    this.courses.sort((a, b) => {
      return a.id > b.id ? -1 : 1;
    });

    this.toastr.success(
      this.translate.instant('my-courses.course-saved', { coursename: response.body.name }),
      this.translate.instant('my-courses.duplicate-success'),
      {
        positionClass: 'toast-top-center',
        timeOut: 5000,
      }
    );
  }

  protected onSaveError(): void {
    this.toastr.error('', this.translate.instant('my-courses.duplicate-error'), {
      positionClass: 'toast-top-center',
      timeOut: 5000,
    });
  }

  orderData(): void {
    switch (this.orderBy) {
      case 'date': {
        this.courses.sort((a, b) => {
          return this.compare(a.id, b.id, this.orderAsc);
        });
        break;
      }
      case 'controlpoints': {
        this.courses.sort((a, b) => {
          return this.compare(a.controlpoints.length, b.controlpoints.length, this.orderAsc);
        });
        break;
      }
      case 'name': {
        this.courses.sort((a, b) => {
          return this.compare(a.name.toLowerCase(), b.name.toLowerCase(), this.orderAsc);
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
    this.courses = this.allCourses.filter(course => course.name.toLowerCase().includes(text));
    this.orderData();
  }
}
