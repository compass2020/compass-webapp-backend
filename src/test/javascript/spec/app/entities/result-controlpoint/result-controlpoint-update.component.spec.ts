import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { of } from 'rxjs';

import { CompassTestModule } from '../../../test.module';
import { ResultControlpointUpdateComponent } from 'app/entities/result-controlpoint/result-controlpoint-update.component';
import { ResultControlpointService } from 'app/entities/result-controlpoint/result-controlpoint.service';
import { ResultControlpoint } from 'app/shared/model/result-controlpoint.model';

describe('Component Tests', () => {
  describe('ResultControlpoint Management Update Component', () => {
    let comp: ResultControlpointUpdateComponent;
    let fixture: ComponentFixture<ResultControlpointUpdateComponent>;
    let service: ResultControlpointService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [CompassTestModule],
        declarations: [ResultControlpointUpdateComponent],
        providers: [FormBuilder],
      })
        .overrideTemplate(ResultControlpointUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(ResultControlpointUpdateComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(ResultControlpointService);
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', fakeAsync(() => {
        // GIVEN
        const entity = new ResultControlpoint(123);
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
        const entity = new ResultControlpoint();
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
