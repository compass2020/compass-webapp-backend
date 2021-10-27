import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { CompassTestModule } from '../../../test.module';
import { ControlpointInfoComponent } from 'app/entities/controlpoint-info/controlpoint-info.component';
import { ControlpointInfoService } from 'app/entities/controlpoint-info/controlpoint-info.service';
import { ControlpointInfo } from 'app/shared/model/controlpoint-info.model';

describe('Component Tests', () => {
  describe('ControlpointInfo Management Component', () => {
    let comp: ControlpointInfoComponent;
    let fixture: ComponentFixture<ControlpointInfoComponent>;
    let service: ControlpointInfoService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [CompassTestModule],
        declarations: [ControlpointInfoComponent],
      })
        .overrideTemplate(ControlpointInfoComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(ControlpointInfoComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(ControlpointInfoService);
    });

    it('Should call load all on init', () => {
      // GIVEN
      const headers = new HttpHeaders().append('link', 'link;link');
      spyOn(service, 'query').and.returnValue(
        of(
          new HttpResponse({
            body: [new ControlpointInfo(123)],
            headers,
          })
        )
      );

      // WHEN
      comp.ngOnInit();

      // THEN
      expect(service.query).toHaveBeenCalled();
      expect(comp.controlpointInfos && comp.controlpointInfos[0]).toEqual(jasmine.objectContaining({ id: 123 }));
    });
  });
});
