import { TestBed, getTestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import * as moment from 'moment';
import { DATE_TIME_FORMAT } from 'app/shared/constants/input.constants';
import { SharedCourseService } from 'app/entities/shared-course/shared-course.service';
import { ISharedCourse, SharedCourse } from 'app/shared/model/shared-course.model';
import { GameModus } from 'app/shared/model/enumerations/game-modus.model';

describe('Service Tests', () => {
  describe('SharedCourse Service', () => {
    let injector: TestBed;
    let service: SharedCourseService;
    let httpMock: HttpTestingController;
    let elemDefault: ISharedCourse;
    let expectedResult: ISharedCourse | ISharedCourse[] | boolean | null;
    let currentDate: moment.Moment;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      injector = getTestBed();
      service = injector.get(SharedCourseService);
      httpMock = injector.get(HttpTestingController);
      currentDate = moment();

      elemDefault = new SharedCourse(
        0,
        'AAAAAAA',
        'AAAAAAA',
        GameModus.QRCODE,
        currentDate,
        false,
        currentDate,
        currentDate,
        0,
        false,
        false
      );
    });

    describe('Service methods', () => {
      it('should find an element', () => {
        const returnedFromService = Object.assign(
          {
            timeStampShared: currentDate.format(DATE_TIME_FORMAT),
            timeStampStart: currentDate.format(DATE_TIME_FORMAT),
            timeStampEnd: currentDate.format(DATE_TIME_FORMAT),
          },
          elemDefault
        );

        service.find(123).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(elemDefault);
      });

      it('should create a SharedCourse', () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
            timeStampShared: currentDate.format(DATE_TIME_FORMAT),
            timeStampStart: currentDate.format(DATE_TIME_FORMAT),
            timeStampEnd: currentDate.format(DATE_TIME_FORMAT),
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            timeStampShared: currentDate,
            timeStampStart: currentDate,
            timeStampEnd: currentDate,
          },
          returnedFromService
        );

        service.create(new SharedCourse()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a SharedCourse', () => {
        const returnedFromService = Object.assign(
          {
            name: 'BBBBBB',
            qrCode: 'BBBBBB',
            gameModus: 'BBBBBB',
            timeStampShared: currentDate.format(DATE_TIME_FORMAT),
            visible: true,
            timeStampStart: currentDate.format(DATE_TIME_FORMAT),
            timeStampEnd: currentDate.format(DATE_TIME_FORMAT),
            numberOfCustomQrCodes: 1,
            showCourseBeforeStart: true,
            showPositionAllowed: true,
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            timeStampShared: currentDate,
            timeStampStart: currentDate,
            timeStampEnd: currentDate,
          },
          returnedFromService
        );

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of SharedCourse', () => {
        const returnedFromService = Object.assign(
          {
            name: 'BBBBBB',
            qrCode: 'BBBBBB',
            gameModus: 'BBBBBB',
            timeStampShared: currentDate.format(DATE_TIME_FORMAT),
            visible: true,
            timeStampStart: currentDate.format(DATE_TIME_FORMAT),
            timeStampEnd: currentDate.format(DATE_TIME_FORMAT),
            numberOfCustomQrCodes: 1,
            showCourseBeforeStart: true,
            showPositionAllowed: true,
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            timeStampShared: currentDate,
            timeStampStart: currentDate,
            timeStampEnd: currentDate,
          },
          returnedFromService
        );

        service.query().subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush([returnedFromService]);
        httpMock.verify();
        expect(expectedResult).toContainEqual(expected);
      });

      it('should delete a SharedCourse', () => {
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
