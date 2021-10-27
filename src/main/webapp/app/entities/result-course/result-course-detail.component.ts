import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IResultCourse } from 'app/shared/model/result-course.model';

@Component({
  selector: 'jhi-result-course-detail',
  templateUrl: './result-course-detail.component.html',
})
export class ResultCourseDetailComponent implements OnInit {
  resultCourse: IResultCourse | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ resultCourse }) => (this.resultCourse = resultCourse));
  }

  previousState(): void {
    window.history.back();
  }
}
