import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { of } from 'rxjs';

import { CompassTestModule } from '../../../test.module';
import { OrienteeringMapUpdateComponent } from 'app/entities/orienteering-map/orienteering-map-update.component';
import { OrienteeringMapService } from 'app/entities/orienteering-map/orienteering-map.service';
import { OrienteeringMap } from 'app/shared/model/orienteering-map.model';

describe('Component Tests', () => {
  describe('OrienteeringMap Management Update Component', () => {
    let comp: OrienteeringMapUpdateComponent;
    let fixture: ComponentFixture<OrienteeringMapUpdateComponent>;
    let service: OrienteeringMapService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [CompassTestModule],
        declarations: [OrienteeringMapUpdateComponent],
        providers: [FormBuilder],
      })
        .overrideTemplate(OrienteeringMapUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(OrienteeringMapUpdateComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(OrienteeringMapService);
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', fakeAsync(() => {
        // GIVEN
        const entity = new OrienteeringMap(123);
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
        const entity = new OrienteeringMap();
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
