import { ISharedCourse } from './../shared/model/shared-course.model';
import { SharedCourseService } from 'app/entities/shared-course/shared-course.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse } from '@angular/common/http';
import { JhiLanguageService } from 'ng-jhipster';

@Component({
  selector: 'jhi-print-share-qrcodes',
  templateUrl: './print-share-qrcodes.component.html',
  styleUrls: ['./print-share-qrcodes.component.scss'],
})
export class PrintShareQrcodesComponent implements OnInit {
  sharedCourseID!: number;
  sharedCourse: ISharedCourse;
  qrcodes!: string[];
  singlePageForOneQR = true;

  constructor(
    private route: ActivatedRoute,
    protected sharedCourseService: SharedCourseService,
    public jhiTranslateLanguage: JhiLanguageService
  ) {}

  ngOnInit(): void {
    this.sharedCourseID = +this.route.snapshot.paramMap.get('id');

    if (this.sharedCourseID !== undefined) {
      this.qrcodes = [];
      this.loadQRCodesFromDB(this.sharedCourseID);
    }
  }

  loadQRCodesFromDB(id: number): void {
    this.sharedCourseService.getQrCodesForSharedCourse(id).subscribe((res: HttpResponse<ISharedCourse>) => {
      this.sharedCourse = res.body || undefined;
      if (this.sharedCourse !== undefined) {
        this.sharedCourse.sharedCourseQrCodes.sort((a, b) => (a.qrCode > b.qrCode ? 1 : -1)); // Sort to assure they have the same sequence every time
        document.title = this.sharedCourse.course.name;
      }
    });
  }

  print(): void {
    document.getElementById('logo').style.display = 'block';
    (document.getElementsByTagName('jhi-navbar')[0] as HTMLElement).style.display = 'none';
    (document.getElementsByTagName('jhi-footer')[0] as HTMLElement).style.display = 'none';
    document.getElementById('printMenu').style.display = 'none';
    document.getElementById('headline').style.display = 'none';

    if (this.singlePageForOneQR) {
      document.getElementById('big_layout').style.display = 'block';
      document.getElementById('big_logo').style.display = 'block';
      document.getElementById('small_layout').style.display = 'none';
    } else {
      document.getElementById('big_layout').style.display = 'none';
      document.getElementById('small_layout').style.display = 'block';
    }

    window.print();

    document.getElementById('logo').style.display = 'none';
    (document.getElementsByTagName('jhi-navbar')[0] as HTMLElement).style.display = 'inline';
    (document.getElementsByTagName('jhi-footer')[0] as HTMLElement).style.display = 'inline';

    document.getElementById('big_layout').style.display = 'none';
    document.getElementById('big_logo').style.display = 'none';
    document.getElementById('small_layout').style.display = 'block';
    document.getElementById('headline').style.display = 'block';
    document.getElementById('printMenu').style.display = 'block';
  }
}
