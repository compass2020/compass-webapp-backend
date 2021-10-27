import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { CompassTestModule } from '../../../test.module';
import { SharedCourseQrCodeDetailComponent } from 'app/entities/shared-course-qr-code/shared-course-qr-code-detail.component';
import { SharedCourseQrCode } from 'app/shared/model/shared-course-qr-code.model';

describe('Component Tests', () => {
  describe('SharedCourseQrCode Management Detail Component', () => {
    let comp: SharedCourseQrCodeDetailComponent;
    let fixture: ComponentFixture<SharedCourseQrCodeDetailComponent>;
    const route = ({ data: of({ sharedCourseQrCode: new SharedCourseQrCode(123) }) } as any) as ActivatedRoute;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [CompassTestModule],
        declarations: [SharedCourseQrCodeDetailComponent],
        providers: [{ provide: ActivatedRoute, useValue: route }],
      })
        .overrideTemplate(SharedCourseQrCodeDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(SharedCourseQrCodeDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load sharedCourseQrCode on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.sharedCourseQrCode).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});
