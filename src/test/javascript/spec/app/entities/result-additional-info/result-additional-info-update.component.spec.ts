import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { of } from 'rxjs';

import { CompassTestModule } from '../../../test.module';
import { ResultAdditionalInfoUpdateComponent } from 'app/entities/result-additional-info/result-additional-info-update.component';
import { ResultAdditionalInfoService } from 'app/entities/result-additional-info/result-additional-info.service';
import { ResultAdditionalInfo } from 'app/shared/model/result-additional-info.model';

describe('Component Tests', () => {
  describe('ResultAdditionalInfo Management Update Component', () => {
    let comp: ResultAdditionalInfoUpdateComponent;
    let fixture: ComponentFixture<ResultAdditionalInfoUpdateComponent>;
    let service: ResultAdditionalInfoService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [CompassTestModule],
        declarations: [ResultAdditionalInfoUpdateComponent],
        providers: [FormBuilder],
      })
        .overrideTemplate(ResultAdditionalInfoUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(ResultAdditionalInfoUpdateComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(ResultAdditionalInfoService);
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', fakeAsync(() => {
        // GIVEN
        const entity = new ResultAdditionalInfo(123);
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
        const entity = new ResultAdditionalInfo();
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
