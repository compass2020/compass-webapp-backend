import { TestBed, getTestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import * as moment from 'moment';
import { DATE_TIME_FORMAT } from 'app/shared/constants/input.constants';
import { SharedCourseQrCodeService } from 'app/entities/shared-course-qr-code/shared-course-qr-code.service';
import { ISharedCourseQrCode, SharedCourseQrCode } from 'app/shared/model/shared-course-qr-code.model';

describe('Service Tests', () => {
  describe('SharedCourseQrCode Service', () => {
    let injector: TestBed;
    let service: SharedCourseQrCodeService;
    let httpMock: HttpTestingController;
    let elemDefault: ISharedCourseQrCode;
    let expectedResult: ISharedCourseQrCode | ISharedCourseQrCode[] | boolean | null;
    let currentDate: moment.Moment;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      injector = getTestBed();
      service = injector.get(SharedCourseQrCodeService);
      httpMock = injector.get(HttpTestingController);
      currentDate = moment();

      elemDefault = new SharedCourseQrCode(0, 'AAAAAAA', 'AAAAAAA', false, currentDate);
    });

    describe('Service methods', () => {
      it('should find an element', () => {
        const returnedFromService = Object.assign(
          {
            timeStampScanned: currentDate.format(DATE_TIME_FORMAT),
          },
          elemDefault
        );

        service.find(123).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(elemDefault);
      });

      it('should create a SharedCourseQrCode', () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
            timeStampScanned: currentDate.format(DATE_TIME_FORMAT),
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            timeStampScanned: currentDate,
          },
          returnedFromService
        );

        service.create(new SharedCourseQrCode()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a SharedCourseQrCode', () => {
        const returnedFromService = Object.assign(
          {
            device: 'BBBBBB',
            qrCode: 'BBBBBB',
            scanned: true,
            timeStampScanned: currentDate.format(DATE_TIME_FORMAT),
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            timeStampScanned: currentDate,
          },
          returnedFromService
        );

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of SharedCourseQrCode', () => {
        const returnedFromService = Object.assign(
          {
            device: 'BBBBBB',
            qrCode: 'BBBBBB',
            scanned: true,
            timeStampScanned: currentDate.format(DATE_TIME_FORMAT),
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            timeStampScanned: currentDate,
          },
          returnedFromService
        );

        service.query().subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush([returnedFromService]);
        httpMock.verify();
        expect(expectedResult).toContainEqual(expected);
      });

      it('should delete a SharedCourseQrCode', () => {
        service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
