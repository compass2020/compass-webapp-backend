import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { CompassTestModule } from '../../../test.module';
import { ResultQuestionComponent } from 'app/entities/result-question/result-question.component';
import { ResultQuestionService } from 'app/entities/result-question/result-question.service';
import { ResultQuestion } from 'app/shared/model/result-question.model';

describe('Component Tests', () => {
  describe('ResultQuestion Management Component', () => {
    let comp: ResultQuestionComponent;
    let fixture: ComponentFixture<ResultQuestionComponent>;
    let service: ResultQuestionService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [CompassTestModule],
        declarations: [ResultQuestionComponent],
      })
        .overrideTemplate(ResultQuestionComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(ResultQuestionComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(ResultQuestionService);
    });

    it('Should call load all on init', () => {
      // GIVEN
      const headers = new HttpHeaders().append('link', 'link;link');
      spyOn(service, 'query').and.returnValue(
        of(
          new HttpResponse({
            body: [new ResultQuestion(123)],
            headers,
          })
        )
      );

      // WHEN
      comp.ngOnInit();

      // THEN
      expect(service.query).toHaveBeenCalled();
      expect(comp.resultQuestions && comp.resultQuestions[0]).toEqual(jasmine.objectContaining({ id: 123 }));
    });
  });
});
