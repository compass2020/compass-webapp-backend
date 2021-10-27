import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { CompassTestModule } from '../../../test.module';
import { SharedCourseComponent } from 'app/entities/shared-course/shared-course.component';
import { SharedCourseService } from 'app/entities/shared-course/shared-course.service';
import { SharedCourse } from 'app/shared/model/shared-course.model';

describe('Component Tests', () => {
  describe('SharedCourse Management Component', () => {
    let comp: SharedCourseComponent;
    let fixture: ComponentFixture<SharedCourseComponent>;
    let service: SharedCourseService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [CompassTestModule],
        declarations: [SharedCourseComponent],
      })
        .overrideTemplate(SharedCourseComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(SharedCourseComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(SharedCourseService);
    });

    it('Should call load all on init', () => {
      // GIVEN
      const headers = new HttpHeaders().append('link', 'link;link');
      spyOn(service, 'query').and.returnValue(
        of(
          new HttpResponse({
            body: [new SharedCourse(123)],
            headers,
          })
        )
      );

      // WHEN
      comp.ngOnInit();

      // THEN
      expect(service.query).toHaveBeenCalled();
      expect(comp.sharedCourses && comp.sharedCourses[0]).toEqual(jasmine.objectContaining({ id: 123 }));
    });
  });
});
