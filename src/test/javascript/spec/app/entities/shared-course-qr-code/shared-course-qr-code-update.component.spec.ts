import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { of } from 'rxjs';

import { CompassTestModule } from '../../../test.module';
import { SharedCourseQrCodeUpdateComponent } from 'app/entities/shared-course-qr-code/shared-course-qr-code-update.component';
import { SharedCourseQrCodeService } from 'app/entities/shared-course-qr-code/shared-course-qr-code.service';
import { SharedCourseQrCode } from 'app/shared/model/shared-course-qr-code.model';

describe('Component Tests', () => {
  describe('SharedCourseQrCode Management Update Component', () => {
    let comp: SharedCourseQrCodeUpdateComponent;
    let fixture: ComponentFixture<SharedCourseQrCodeUpdateComponent>;
    let service: SharedCourseQrCodeService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [CompassTestModule],
        declarations: [SharedCourseQrCodeUpdateComponent],
        providers: [FormBuilder],
      })
        .overrideTemplate(SharedCourseQrCodeUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(SharedCourseQrCodeUpdateComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(SharedCourseQrCodeService);
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', fakeAsync(() => {
        // GIVEN
        const entity = new SharedCourseQrCode(123);
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
        const entity = new SharedCourseQrCode();
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
