import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { of } from 'rxjs';

import { CompassTestModule } from '../../../test.module';
import { ControlpointUpdateComponent } from 'app/entities/controlpoint/controlpoint-update.component';
import { ControlpointService } from 'app/entities/controlpoint/controlpoint.service';
import { Controlpoint } from 'app/shared/model/controlpoint.model';

describe('Component Tests', () => {
  describe('Controlpoint Management Update Component', () => {
    let comp: ControlpointUpdateComponent;
    let fixture: ComponentFixture<ControlpointUpdateComponent>;
    let service: ControlpointService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [CompassTestModule],
        declarations: [ControlpointUpdateComponent],
        providers: [FormBuilder],
      })
        .overrideTemplate(ControlpointUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(ControlpointUpdateComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(ControlpointService);
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', fakeAsync(() => {
        // GIVEN
        const entity = new Controlpoint(123);
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
        const entity = new Controlpoint();
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
