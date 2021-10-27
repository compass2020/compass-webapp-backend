import { TestBed, getTestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import * as moment from 'moment';
import { DATE_TIME_FORMAT } from 'app/shared/constants/input.constants';
import { ResultControlpointService } from 'app/entities/result-controlpoint/result-controlpoint.service';
import { IResultControlpoint, ResultControlpoint } from 'app/shared/model/result-controlpoint.model';

describe('Service Tests', () => {
  describe('ResultControlpoint Service', () => {
    let injector: TestBed;
    let service: ResultControlpointService;
    let httpMock: HttpTestingController;
    let elemDefault: IResultControlpoint;
    let expectedResult: IResultControlpoint | IResultControlpoint[] | boolean | null;
    let currentDate: moment.Moment;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      injector = getTestBed();
      service = injector.get(ResultControlpointService);
      httpMock = injector.get(HttpTestingController);
      currentDate = moment();

      elemDefault = new ResultControlpoint(0, 0, currentDate, 0, 0, false, false, 0, false);
    });

    describe('Service methods', () => {
      it('should find an element', () => {
        const returnedFromService = Object.assign(
          {
            timeReached: currentDate.format(DATE_TIME_FORMAT),
          },
          elemDefault
        );

        service.find(123).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(elemDefault);
      });

      it('should create a ResultControlpoint', () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
            timeReached: currentDate.format(DATE_TIME_FORMAT),
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            timeReached: currentDate,
          },
          returnedFromService
        );

        service.create(new ResultControlpoint()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a ResultControlpoint', () => {
        const returnedFromService = Object.assign(
          {
            sequence: 1,
            timeReached: currentDate.format(DATE_TIME_FORMAT),
            latitude: 1,
            longitude: 1,
            skipAllowed: true,
            reached: true,
            borgScale: 1,
            forceSkipped: true,
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            timeReached: currentDate,
          },
          returnedFromService
        );

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of ResultControlpoint', () => {
        const returnedFromService = Object.assign(
          {
            sequence: 1,
            timeReached: currentDate.format(DATE_TIME_FORMAT),
            latitude: 1,
            longitude: 1,
            skipAllowed: true,
            reached: true,
            borgScale: 1,
            forceSkipped: true,
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            timeReached: currentDate,
          },
          returnedFromService
        );

        service.query().subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush([returnedFromService]);
        httpMock.verify();
        expect(expectedResult).toContainEqual(expected);
      });

      it('should delete a ResultControlpoint', () => {
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
