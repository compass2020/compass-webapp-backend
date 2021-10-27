import { TestBed, getTestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ControlpointInfoService } from 'app/entities/controlpoint-info/controlpoint-info.service';
import { IControlpointInfo, ControlpointInfo } from 'app/shared/model/controlpoint-info.model';
import { ControlpointInfoColumn } from 'app/shared/model/enumerations/controlpoint-info-column.model';

describe('Service Tests', () => {
  describe('ControlpointInfo Service', () => {
    let injector: TestBed;
    let service: ControlpointInfoService;
    let httpMock: HttpTestingController;
    let elemDefault: IControlpointInfo;
    let expectedResult: IControlpointInfo | IControlpointInfo[] | boolean | null;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      injector = getTestBed();
      service = injector.get(ControlpointInfoService);
      httpMock = injector.get(HttpTestingController);

      elemDefault = new ControlpointInfo(0, 'image/png', 'AAAAAAA', ControlpointInfoColumn.C, 'AAAAAAA', 'AAAAAAA', 0);
    });

    describe('Service methods', () => {
      it('should find an element', () => {
        const returnedFromService = Object.assign({}, elemDefault);

        service.find(123).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(elemDefault);
      });

      it('should create a ControlpointInfo', () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.create(new ControlpointInfo()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a ControlpointInfo', () => {
        const returnedFromService = Object.assign(
          {
            image: 'BBBBBB',
            col: 'BBBBBB',
            description: 'BBBBBB',
            messageKey: 'BBBBBB',
            sort: 1,
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of ControlpointInfo', () => {
        const returnedFromService = Object.assign(
          {
            image: 'BBBBBB',
            col: 'BBBBBB',
            description: 'BBBBBB',
            messageKey: 'BBBBBB',
            sort: 1,
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.query().subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush([returnedFromService]);
        httpMock.verify();
        expect(expectedResult).toContainEqual(expected);
      });

      it('should delete a ControlpointInfo', () => {
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
