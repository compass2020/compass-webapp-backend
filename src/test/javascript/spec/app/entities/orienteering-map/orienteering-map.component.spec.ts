import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { CompassTestModule } from '../../../test.module';
import { OrienteeringMapComponent } from 'app/entities/orienteering-map/orienteering-map.component';
import { OrienteeringMapService } from 'app/entities/orienteering-map/orienteering-map.service';
import { OrienteeringMap } from 'app/shared/model/orienteering-map.model';

describe('Component Tests', () => {
  describe('OrienteeringMap Management Component', () => {
    let comp: OrienteeringMapComponent;
    let fixture: ComponentFixture<OrienteeringMapComponent>;
    let service: OrienteeringMapService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [CompassTestModule],
        declarations: [OrienteeringMapComponent],
      })
        .overrideTemplate(OrienteeringMapComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(OrienteeringMapComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(OrienteeringMapService);
    });

    it('Should call load all on init', () => {
      // GIVEN
      const headers = new HttpHeaders().append('link', 'link;link');
      spyOn(service, 'query').and.returnValue(
        of(
          new HttpResponse({
            body: [new OrienteeringMap(123)],
            headers,
          })
        )
      );

      // WHEN
      comp.ngOnInit();

      // THEN
      expect(service.query).toHaveBeenCalled();
      expect(comp.orienteeringMaps && comp.orienteeringMaps[0]).toEqual(jasmine.objectContaining({ id: 123 }));
    });
  });
});
