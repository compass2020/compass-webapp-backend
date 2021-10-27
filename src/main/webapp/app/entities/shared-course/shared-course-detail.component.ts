import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ISharedCourse } from 'app/shared/model/shared-course.model';

@Component({
  selector: 'jhi-shared-course-detail',
  templateUrl: './shared-course-detail.component.html',
})
export class SharedCourseDetailComponent implements OnInit {
  sharedCourse: ISharedCourse | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ sharedCourse }) => (this.sharedCourse = sharedCourse));
  }

  previousState(): void {
    window.history.back();
  }
}
