import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ISharedCourseQrCode } from 'app/shared/model/shared-course-qr-code.model';

@Component({
  selector: 'jhi-shared-course-qr-code-detail',
  templateUrl: './shared-course-qr-code-detail.component.html',
})
export class SharedCourseQrCodeDetailComponent implements OnInit {
  sharedCourseQrCode: ISharedCourseQrCode | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ sharedCourseQrCode }) => (this.sharedCourseQrCode = sharedCourseQrCode));
  }

  previousState(): void {
    window.history.back();
  }
}
