import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { CompassTestModule } from '../../../test.module';
import { ControlpointComponent } from 'app/entities/controlpoint/controlpoint.component';
import { ControlpointService } from 'app/entities/controlpoint/controlpoint.service';
import { Controlpoint } from 'app/shared/model/controlpoint.model';

describe('Component Tests', () => {
  describe('Controlpoint Management Component', () => {
    let comp: ControlpointComponent;
    let fixture: ComponentFixture<ControlpointComponent>;
    let service: ControlpointService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [CompassTestModule],
        declarations: [ControlpointComponent],
      })
        .overrideTemplate(ControlpointComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(ControlpointComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(ControlpointService);
    });

    it('Should call load all on init', () => {
      // GIVEN
      const headers = new HttpHeaders().append('link', 'link;link');
      spyOn(service, 'query').and.returnValue(
        of(
          new HttpResponse({
            body: [new Controlpoint(123)],
            headers,
          })
        )
      );

      // WHEN
      comp.ngOnInit();

      // THEN
      expect(service.query).toHaveBeenCalled();
      expect(comp.controlpoints && comp.controlpoints[0]).toEqual(jasmine.objectContaining({ id: 123 }));
    });
  });
});
