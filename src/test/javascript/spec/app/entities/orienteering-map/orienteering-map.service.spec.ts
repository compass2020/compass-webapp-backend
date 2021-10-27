import { TestBed, getTestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { OrienteeringMapService } from 'app/entities/orienteering-map/orienteering-map.service';
import { IOrienteeringMap, OrienteeringMap } from 'app/shared/model/orienteering-map.model';

describe('Service Tests', () => {
  describe('OrienteeringMap Service', () => {
    let injector: TestBed;
    let service: OrienteeringMapService;
    let httpMock: HttpTestingController;
    let elemDefault: IOrienteeringMap;
    let expectedResult: IOrienteeringMap | IOrienteeringMap[] | boolean | null;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      injector = getTestBed();
      service = injector.get(OrienteeringMapService);
      httpMock = injector.get(HttpTestingController);

      elemDefault = new OrienteeringMap(0, 'image/png', 'AAAAAAA', 'image/png', 'AAAAAAA', 0, 0, 0, 0, 0, 0);
    });

    describe('Service methods', () => {
      it('should find an element', () => {
        const returnedFromService = Object.assign({}, elemDefault);

        service.find(123).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(elemDefault);
      });

      it('should create a OrienteeringMap', () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.create(new OrienteeringMap()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a OrienteeringMap', () => {
        const returnedFromService = Object.assign(
          {
            mapOverlayImage: 'BBBBBB',
            mapOverlayKml: 'BBBBBB',
            imageScaleX: 1,
            imageScaleY: 1,
            imageCenterX: 1,
            imageCenterY: 1,
            imageRotation: 1,
            declination: 1,
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of OrienteeringMap', () => {
        const returnedFromService = Object.assign(
          {
            mapOverlayImage: 'BBBBBB',
            mapOverlayKml: 'BBBBBB',
            imageScaleX: 1,
            imageScaleY: 1,
            imageCenterX: 1,
            imageCenterY: 1,
            imageRotation: 1,
            declination: 1,
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

      it('should delete a OrienteeringMap', () => {
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
