import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { CompassTestModule } from '../../../test.module';
import { ResultControlpointComponent } from 'app/entities/result-controlpoint/result-controlpoint.component';
import { ResultControlpointService } from 'app/entities/result-controlpoint/result-controlpoint.service';
import { ResultControlpoint } from 'app/shared/model/result-controlpoint.model';

describe('Component Tests', () => {
  describe('ResultControlpoint Management Component', () => {
    let comp: ResultControlpointComponent;
    let fixture: ComponentFixture<ResultControlpointComponent>;
    let service: ResultControlpointService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [CompassTestModule],
        declarations: [ResultControlpointComponent],
      })
        .overrideTemplate(ResultControlpointComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(ResultControlpointComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(ResultControlpointService);
    });

    it('Should call load all on init', () => {
      // GIVEN
      const headers = new HttpHeaders().append('link', 'link;link');
      spyOn(service, 'query').and.returnValue(
        of(
          new HttpResponse({
            body: [new ResultControlpoint(123)],
            headers,
          })
        )
      );

      // WHEN
      comp.ngOnInit();

      // THEN
      expect(service.query).toHaveBeenCalled();
      expect(comp.resultControlpoints && comp.resultControlpoints[0]).toEqual(jasmine.objectContaining({ id: 123 }));
    });
  });
});
