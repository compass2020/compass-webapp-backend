import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { CompassTestModule } from '../../../test.module';
import { ResultAnswerComponent } from 'app/entities/result-answer/result-answer.component';
import { ResultAnswerService } from 'app/entities/result-answer/result-answer.service';
import { ResultAnswer } from 'app/shared/model/result-answer.model';

describe('Component Tests', () => {
  describe('ResultAnswer Management Component', () => {
    let comp: ResultAnswerComponent;
    let fixture: ComponentFixture<ResultAnswerComponent>;
    let service: ResultAnswerService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [CompassTestModule],
        declarations: [ResultAnswerComponent],
      })
        .overrideTemplate(ResultAnswerComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(ResultAnswerComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(ResultAnswerService);
    });

    it('Should call load all on init', () => {
      // GIVEN
      const headers = new HttpHeaders().append('link', 'link;link');
      spyOn(service, 'query').and.returnValue(
        of(
          new HttpResponse({
            body: [new ResultAnswer(123)],
            headers,
          })
        )
      );

      // WHEN
      comp.ngOnInit();

      // THEN
      expect(service.query).toHaveBeenCalled();
      expect(comp.resultAnswers && comp.resultAnswers[0]).toEqual(jasmine.objectContaining({ id: 123 }));
    });
  });
});
