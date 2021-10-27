import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { CompassTestModule } from '../../../test.module';
import { ResultQuestionDetailComponent } from 'app/entities/result-question/result-question-detail.component';
import { ResultQuestion } from 'app/shared/model/result-question.model';

describe('Component Tests', () => {
  describe('ResultQuestion Management Detail Component', () => {
    let comp: ResultQuestionDetailComponent;
    let fixture: ComponentFixture<ResultQuestionDetailComponent>;
    const route = ({ data: of({ resultQuestion: new ResultQuestion(123) }) } as any) as ActivatedRoute;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [CompassTestModule],
        declarations: [ResultQuestionDetailComponent],
        providers: [{ provide: ActivatedRoute, useValue: route }],
      })
        .overrideTemplate(ResultQuestionDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(ResultQuestionDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load resultQuestion on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.resultQuestion).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});
