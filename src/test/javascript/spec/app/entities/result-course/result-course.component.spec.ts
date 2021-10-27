import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { CompassTestModule } from '../../../test.module';
import { ResultCourseComponent } from 'app/entities/result-course/result-course.component';
import { ResultCourseService } from 'app/entities/result-course/result-course.service';
import { ResultCourse } from 'app/shared/model/result-course.model';

describe('Component Tests', () => {
  describe('ResultCourse Management Component', () => {
    let comp: ResultCourseComponent;
    let fixture: ComponentFixture<ResultCourseComponent>;
    let service: ResultCourseService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [CompassTestModule],
        declarations: [ResultCourseComponent],
      })
        .overrideTemplate(ResultCourseComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(ResultCourseComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(ResultCourseService);
    });

    it('Should call load all on init', () => {
      // GIVEN
      const headers = new HttpHeaders().append('link', 'link;link');
      spyOn(service, 'query').and.returnValue(
        of(
          new HttpResponse({
            body: [new ResultCourse(123)],
            headers,
          })
        )
      );

      // WHEN
      comp.ngOnInit();

      // THEN
      expect(service.query).toHaveBeenCalled();
      expect(comp.resultCourses && comp.resultCourses[0]).toEqual(jasmine.objectContaining({ id: 123 }));
    });
  });
});
