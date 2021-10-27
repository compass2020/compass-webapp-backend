import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { CompassTestModule } from '../../../test.module';
import { SharedCourseQrCodeComponent } from 'app/entities/shared-course-qr-code/shared-course-qr-code.component';
import { SharedCourseQrCodeService } from 'app/entities/shared-course-qr-code/shared-course-qr-code.service';
import { SharedCourseQrCode } from 'app/shared/model/shared-course-qr-code.model';

describe('Component Tests', () => {
  describe('SharedCourseQrCode Management Component', () => {
    let comp: SharedCourseQrCodeComponent;
    let fixture: ComponentFixture<SharedCourseQrCodeComponent>;
    let service: SharedCourseQrCodeService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [CompassTestModule],
        declarations: [SharedCourseQrCodeComponent],
      })
        .overrideTemplate(SharedCourseQrCodeComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(SharedCourseQrCodeComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(SharedCourseQrCodeService);
    });

    it('Should call load all on init', () => {
      // GIVEN
      const headers = new HttpHeaders().append('link', 'link;link');
      spyOn(service, 'query').and.returnValue(
        of(
          new HttpResponse({
            body: [new SharedCourseQrCode(123)],
            headers,
          })
        )
      );

      // WHEN
      comp.ngOnInit();

      // THEN
      expect(service.query).toHaveBeenCalled();
      expect(comp.sharedCourseQrCodes && comp.sharedCourseQrCodes[0]).toEqual(jasmine.objectContaining({ id: 123 }));
    });
  });
});
