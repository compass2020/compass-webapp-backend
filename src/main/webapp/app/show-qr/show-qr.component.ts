import { Component, OnInit, Input } from '@angular/core';
import { ISharedCourse } from 'app/shared/model/shared-course.model';
import { JhiLanguageService } from 'ng-jhipster';

@Component({
  selector: 'jhi-show-qr',
  templateUrl: './show-qr.component.html',
  styleUrls: ['./show-qr.component.scss'],
})
export class ShowQRComponent implements OnInit {
  @Input() public sharedCourse: ISharedCourse;

  constructor(public jhiTranslateLanguage: JhiLanguageService) {}

  ngOnInit(): void {}
  saveAsImage(): void {
    // fetches base 64 date from image
    const canvas = document.getElementById('qrCodeElement').getElementsByTagName('canvas')[0];

    // converts base 64 encoded image to blobData
    const blobData = this.convertBase64ToBlob(canvas.toDataURL('image/jpeg', 0.8));
    const filename = this.sharedCourse.course.name + '_' + this.sharedCourse.name;
    // saves as image
    if (window.navigator && window.navigator.msSaveOrOpenBlob) {
      // IE
      window.navigator.msSaveOrOpenBlob(blobData, filename);
    } else {
      // chrome
      const blob = new Blob([blobData], { type: 'image/png' });
      const url = window.URL.createObjectURL(blob);
      // window.open(url);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      link.click();
    }
  }
  private convertBase64ToBlob(Base64Image: any): Blob {
    // SPLIT INTO TWO PARTS
    const parts = Base64Image.split(';base64,');
    // HOLD THE CONTENT TYPE
    const imageType = parts[0].split(':')[1];
    // DECODE BASE64 STRING
    const decodedData = window.atob(parts[1]);
    // CREATE UNIT8ARRAY OF SIZE SAME AS ROW DATA LENGTH
    const uInt8Array = new Uint8Array(decodedData.length);
    // INSERT ALL CHARACTER CODE INTO UINT8ARRAY
    for (let i = 0; i < decodedData.length; ++i) {
      uInt8Array[i] = decodedData.charCodeAt(i);
    }
    // RETURN BLOB IMAGE AFTER CONVERSION
    return new Blob([uInt8Array], { type: imageType });
  }
}
