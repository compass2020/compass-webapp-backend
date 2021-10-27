import { TestBed, getTestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { QuestionService } from 'app/entities/question/question.service';
import { IQuestion, Question } from 'app/shared/model/question.model';
import { QuestionType } from 'app/shared/model/enumerations/question-type.model';
import { Difficulty } from 'app/shared/model/enumerations/difficulty.model';

describe('Service Tests', () => {
  describe('Question Service', () => {
    let injector: TestBed;
    let service: QuestionService;
    let httpMock: HttpTestingController;
    let elemDefault: IQuestion;
    let expectedResult: IQuestion | IQuestion[] | boolean | null;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      injector = getTestBed();
      service = injector.get(QuestionService);
      httpMock = injector.get(HttpTestingController);

      elemDefault = new Question(0, 'AAAAAAA', QuestionType.SINGLE, Difficulty.EASY, false);
    });

    describe('Service methods', () => {
      it('should find an element', () => {
        const returnedFromService = Object.assign({}, elemDefault);

        service.find(123).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(elemDefault);
      });

      it('should create a Question', () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.create(new Question()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a Question', () => {
        const returnedFromService = Object.assign(
          {
            text: 'BBBBBB',
            type: 'BBBBBB',
            difficulty: 'BBBBBB',
            personal: true,
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of Question', () => {
        const returnedFromService = Object.assign(
          {
            text: 'BBBBBB',
            type: 'BBBBBB',
            difficulty: 'BBBBBB',
            personal: true,
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

      it('should delete a Question', () => {
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
