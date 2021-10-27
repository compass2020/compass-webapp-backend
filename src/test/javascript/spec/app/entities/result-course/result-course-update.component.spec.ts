import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { of } from 'rxjs';

import { CompassTestModule } from '../../../test.module';
import { ResultCourseUpdateComponent } from 'app/entities/result-course/result-course-update.component';
import { ResultCourseService } from 'app/entities/result-course/result-course.service';
import { ResultCourse } from 'app/shared/model/result-course.model';

describe('Component Tests', () => {
  describe('ResultCourse Management Update Component', () => {
    let comp: ResultCourseUpdateComponent;
    let fixture: ComponentFixture<ResultCourseUpdateComponent>;
    let service: ResultCourseService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [CompassTestModule],
        declarations: [ResultCourseUpdateComponent],
        providers: [FormBuilder],
      })
        .overrideTemplate(ResultCourseUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(ResultCourseUpdateComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(ResultCourseService);
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', fakeAsync(() => {
        // GIVEN
        const entity = new ResultCourse(123);
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
        const entity = new ResultCourse();
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
