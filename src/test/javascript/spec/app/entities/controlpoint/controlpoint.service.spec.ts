import { TestBed, getTestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ControlpointService } from 'app/entities/controlpoint/controlpoint.service';
import { IControlpoint, Controlpoint } from 'app/shared/model/controlpoint.model';

describe('Service Tests', () => {
  describe('Controlpoint Service', () => {
    let injector: TestBed;
    let service: ControlpointService;
    let httpMock: HttpTestingController;
    let elemDefault: IControlpoint;
    let expectedResult: IControlpoint | IControlpoint[] | boolean | null;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      injector = getTestBed();
      service = injector.get(ControlpointService);
      httpMock = injector.get(HttpTestingController);

      elemDefault = new Controlpoint(0, 0, 0, 0, 0, 0, 0, false, false, 'AAAAAAA', 'AAAAAAA');
    });

    describe('Service methods', () => {
      it('should find an element', () => {
        const returnedFromService = Object.assign({}, elemDefault);

        service.find(123).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(elemDefault);
      });

      it('should create a Controlpoint', () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.create(new Controlpoint()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a Controlpoint', () => {
        const returnedFromService = Object.assign(
          {
            sequence: 1,
            controlCode: 1,
            latitude: 1,
            longitude: 1,
            elevation: 1,
            radius: 1,
            skippable: true,
            team: true,
            qrCode: 'BBBBBB',
            description: 'BBBBBB',
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of Controlpoint', () => {
        const returnedFromService = Object.assign(
          {
            sequence: 1,
            controlCode: 1,
            latitude: 1,
            longitude: 1,
            elevation: 1,
            radius: 1,
            skippable: true,
            team: true,
            qrCode: 'BBBBBB',
            description: 'BBBBBB',
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

      it('should delete a Controlpoint', () => {
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
