import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { CompassTestModule } from '../../../test.module';
import { ResultCourseDetailComponent } from 'app/entities/result-course/result-course-detail.component';
import { ResultCourse } from 'app/shared/model/result-course.model';

describe('Component Tests', () => {
  describe('ResultCourse Management Detail Component', () => {
    let comp: ResultCourseDetailComponent;
    let fixture: ComponentFixture<ResultCourseDetailComponent>;
    const route = ({ data: of({ resultCourse: new ResultCourse(123) }) } as any) as ActivatedRoute;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [CompassTestModule],
        declarations: [ResultCourseDetailComponent],
        providers: [{ provide: ActivatedRoute, useValue: route }],
      })
        .overrideTemplate(ResultCourseDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(ResultCourseDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load resultCourse on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.resultCourse).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});
