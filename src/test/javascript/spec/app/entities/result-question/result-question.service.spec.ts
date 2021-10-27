import { TestBed, getTestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ResultQuestionService } from 'app/entities/result-question/result-question.service';
import { IResultQuestion, ResultQuestion } from 'app/shared/model/result-question.model';
import { QuestionType } from 'app/shared/model/enumerations/question-type.model';
import { Difficulty } from 'app/shared/model/enumerations/difficulty.model';

describe('Service Tests', () => {
  describe('ResultQuestion Service', () => {
    let injector: TestBed;
    let service: ResultQuestionService;
    let httpMock: HttpTestingController;
    let elemDefault: IResultQuestion;
    let expectedResult: IResultQuestion | IResultQuestion[] | boolean | null;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      injector = getTestBed();
      service = injector.get(ResultQuestionService);
      httpMock = injector.get(HttpTestingController);

      elemDefault = new ResultQuestion(0, 'AAAAAAA', QuestionType.SINGLE, Difficulty.EASY, false);
    });

    describe('Service methods', () => {
      it('should find an element', () => {
        const returnedFromService = Object.assign({}, elemDefault);

        service.find(123).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(elemDefault);
      });

      it('should create a ResultQuestion', () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.create(new ResultQuestion()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a ResultQuestion', () => {
        const returnedFromService = Object.assign(
          {
            text: 'BBBBBB',
            type: 'BBBBBB',
            difficulty: 'BBBBBB',
            answeredCorrectly: true,
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of ResultQuestion', () => {
        const returnedFromService = Object.assign(
          {
            text: 'BBBBBB',
            type: 'BBBBBB',
            difficulty: 'BBBBBB',
            answeredCorrectly: true,
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

      it('should delete a ResultQuestion', () => {
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
