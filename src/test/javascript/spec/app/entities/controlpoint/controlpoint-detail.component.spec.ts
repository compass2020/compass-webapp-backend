import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { CompassTestModule } from '../../../test.module';
import { ControlpointDetailComponent } from 'app/entities/controlpoint/controlpoint-detail.component';
import { Controlpoint } from 'app/shared/model/controlpoint.model';

describe('Component Tests', () => {
  describe('Controlpoint Management Detail Component', () => {
    let comp: ControlpointDetailComponent;
    let fixture: ComponentFixture<ControlpointDetailComponent>;
    const route = ({ data: of({ controlpoint: new Controlpoint(123) }) } as any) as ActivatedRoute;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [CompassTestModule],
        declarations: [ControlpointDetailComponent],
        providers: [{ provide: ActivatedRoute, useValue: route }],
      })
        .overrideTemplate(ControlpointDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(ControlpointDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load controlpoint on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.controlpoint).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});
