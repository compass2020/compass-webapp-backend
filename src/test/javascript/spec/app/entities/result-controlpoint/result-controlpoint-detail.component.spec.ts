import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { CompassTestModule } from '../../../test.module';
import { ResultControlpointDetailComponent } from 'app/entities/result-controlpoint/result-controlpoint-detail.component';
import { ResultControlpoint } from 'app/shared/model/result-controlpoint.model';

describe('Component Tests', () => {
  describe('ResultControlpoint Management Detail Component', () => {
    let comp: ResultControlpointDetailComponent;
    let fixture: ComponentFixture<ResultControlpointDetailComponent>;
    const route = ({ data: of({ resultControlpoint: new ResultControlpoint(123) }) } as any) as ActivatedRoute;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [CompassTestModule],
        declarations: [ResultControlpointDetailComponent],
        providers: [{ provide: ActivatedRoute, useValue: route }],
      })
        .overrideTemplate(ResultControlpointDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(ResultControlpointDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load resultControlpoint on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.resultControlpoint).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});
