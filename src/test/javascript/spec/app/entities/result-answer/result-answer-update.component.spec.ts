import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { of } from 'rxjs';

import { CompassTestModule } from '../../../test.module';
import { ResultAnswerUpdateComponent } from 'app/entities/result-answer/result-answer-update.component';
import { ResultAnswerService } from 'app/entities/result-answer/result-answer.service';
import { ResultAnswer } from 'app/shared/model/result-answer.model';

describe('Component Tests', () => {
  describe('ResultAnswer Management Update Component', () => {
    let comp: ResultAnswerUpdateComponent;
    let fixture: ComponentFixture<ResultAnswerUpdateComponent>;
    let service: ResultAnswerService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [CompassTestModule],
        declarations: [ResultAnswerUpdateComponent],
        providers: [FormBuilder],
      })
        .overrideTemplate(ResultAnswerUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(ResultAnswerUpdateComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(ResultAnswerService);
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', fakeAsync(() => {
        // GIVEN
        const entity = new ResultAnswer(123);
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
        const entity = new ResultAnswer();
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
