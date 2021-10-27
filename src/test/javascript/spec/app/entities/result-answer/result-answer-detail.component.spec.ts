import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { CompassTestModule } from '../../../test.module';
import { ResultAnswerDetailComponent } from 'app/entities/result-answer/result-answer-detail.component';
import { ResultAnswer } from 'app/shared/model/result-answer.model';

describe('Component Tests', () => {
  describe('ResultAnswer Management Detail Component', () => {
    let comp: ResultAnswerDetailComponent;
    let fixture: ComponentFixture<ResultAnswerDetailComponent>;
    const route = ({ data: of({ resultAnswer: new ResultAnswer(123) }) } as any) as ActivatedRoute;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [CompassTestModule],
        declarations: [ResultAnswerDetailComponent],
        providers: [{ provide: ActivatedRoute, useValue: route }],
      })
        .overrideTemplate(ResultAnswerDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(ResultAnswerDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load resultAnswer on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.resultAnswer).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});
