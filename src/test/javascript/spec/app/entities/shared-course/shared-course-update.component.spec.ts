import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { of } from 'rxjs';

import { CompassTestModule } from '../../../test.module';
import { SharedCourseUpdateComponent } from 'app/entities/shared-course/shared-course-update.component';
import { SharedCourseService } from 'app/entities/shared-course/shared-course.service';
import { SharedCourse } from 'app/shared/model/shared-course.model';

describe('Component Tests', () => {
  describe('SharedCourse Management Update Component', () => {
    let comp: SharedCourseUpdateComponent;
    let fixture: ComponentFixture<SharedCourseUpdateComponent>;
    let service: SharedCourseService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [CompassTestModule],
        declarations: [SharedCourseUpdateComponent],
        providers: [FormBuilder],
      })
        .overrideTemplate(SharedCourseUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(SharedCourseUpdateComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(SharedCourseService);
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', fakeAsync(() => {
        // GIVEN
        const entity = new SharedCourse(123);
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
        const entity = new SharedCourse();
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
