import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { CompassTestModule } from '../../../test.module';
import { SharedCourseDetailComponent } from 'app/entities/shared-course/shared-course-detail.component';
import { SharedCourse } from 'app/shared/model/shared-course.model';

describe('Component Tests', () => {
  describe('SharedCourse Management Detail Component', () => {
    let comp: SharedCourseDetailComponent;
    let fixture: ComponentFixture<SharedCourseDetailComponent>;
    const route = ({ data: of({ sharedCourse: new SharedCourse(123) }) } as any) as ActivatedRoute;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [CompassTestModule],
        declarations: [SharedCourseDetailComponent],
        providers: [{ provide: ActivatedRoute, useValue: route }],
      })
        .overrideTemplate(SharedCourseDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(SharedCourseDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load sharedCourse on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.sharedCourse).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});
