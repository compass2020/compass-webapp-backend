import { TestBed, getTestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import * as moment from 'moment';
import { DATE_TIME_FORMAT } from 'app/shared/constants/input.constants';
import { ResultCourseService } from 'app/entities/result-course/result-course.service';
import { IResultCourse, ResultCourse } from 'app/shared/model/result-course.model';

describe('Service Tests', () => {
  describe('ResultCourse Service', () => {
    let injector: TestBed;
    let service: ResultCourseService;
    let httpMock: HttpTestingController;
    let elemDefault: IResultCourse;
    let expectedResult: IResultCourse | IResultCourse[] | boolean | null;
    let currentDate: moment.Moment;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      injector = getTestBed();
      service = injector.get(ResultCourseService);
      httpMock = injector.get(HttpTestingController);
      currentDate = moment();

      elemDefault = new ResultCourse(0, 'AAAAAAA', currentDate, currentDate, 0, 'AAAAAAA', 0, 0);
    });

    describe('Service methods', () => {
      it('should find an element', () => {
        const returnedFromService = Object.assign(
          {
            timeStampFinished: currentDate.format(DATE_TIME_FORMAT),
            timeStampStarted: currentDate.format(DATE_TIME_FORMAT),
          },
          elemDefault
        );

        service.find(123).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(elemDefault);
      });

      it('should create a ResultCourse', () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
            timeStampFinished: currentDate.format(DATE_TIME_FORMAT),
            timeStampStarted: currentDate.format(DATE_TIME_FORMAT),
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            timeStampFinished: currentDate,
            timeStampStarted: currentDate,
          },
          returnedFromService
        );

        service.create(new ResultCourse()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a ResultCourse', () => {
        const returnedFromService = Object.assign(
          {
            nickName: 'BBBBBB',
            timeStampFinished: currentDate.format(DATE_TIME_FORMAT),
            timeStampStarted: currentDate.format(DATE_TIME_FORMAT),
            totalDurationInMillis: 1,
            viewCode: 'BBBBBB',
            showPositionCounter: 1,
            switchAppCounter: 1,
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            timeStampFinished: currentDate,
            timeStampStarted: currentDate,
          },
          returnedFromService
        );

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of ResultCourse', () => {
        const returnedFromService = Object.assign(
          {
            nickName: 'BBBBBB',
            timeStampFinished: currentDate.format(DATE_TIME_FORMAT),
            timeStampStarted: currentDate.format(DATE_TIME_FORMAT),
            totalDurationInMillis: 1,
            viewCode: 'BBBBBB',
            showPositionCounter: 1,
            switchAppCounter: 1,
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            timeStampFinished: currentDate,
            timeStampStarted: currentDate,
          },
          returnedFromService
        );

        service.query().subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush([returnedFromService]);
        httpMock.verify();
        expect(expectedResult).toContainEqual(expected);
      });

      it('should delete a ResultCourse', () => {
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
