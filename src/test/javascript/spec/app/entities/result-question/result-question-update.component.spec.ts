import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { of } from 'rxjs';

import { CompassTestModule } from '../../../test.module';
import { ResultQuestionUpdateComponent } from 'app/entities/result-question/result-question-update.component';
import { ResultQuestionService } from 'app/entities/result-question/result-question.service';
import { ResultQuestion } from 'app/shared/model/result-question.model';

describe('Component Tests', () => {
  describe('ResultQuestion Management Update Component', () => {
    let comp: ResultQuestionUpdateComponent;
    let fixture: ComponentFixture<ResultQuestionUpdateComponent>;
    let service: ResultQuestionService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [CompassTestModule],
        declarations: [ResultQuestionUpdateComponent],
        providers: [FormBuilder],
      })
        .overrideTemplate(ResultQuestionUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(ResultQuestionUpdateComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(ResultQuestionService);
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', fakeAsync(() => {
        // GIVEN
        const entity = new ResultQuestion(123);
        spyOn(service, 'update').and.returnValue(of(new HttpResponse({ body: entity })));
        comp.updateForm(entity);
        // WHEN
        comp.save();
        tick(); // simulate async

        // THEN
        expect(service.update).toHaveBeenCalledWith(entity);
        expect(comp.isSaving).toEqual(false);
      }));

      it('Should call create service on save for new entity', fakeAsync(() => {
        // GIVEN
        const entity = new ResultQuestion();
        spyOn(service, 'create').and.returnValue(of(new HttpResponse({ body: entity })));
        comp.updateForm(entity);
        // WHEN
        comp.save();
        tick(); // simulate async

        // THEN
        expect(service.create).toHaveBeenCalledWith(entity);
        expect(comp.isSaving).toEqual(false);
      }));
    });
  });
});
