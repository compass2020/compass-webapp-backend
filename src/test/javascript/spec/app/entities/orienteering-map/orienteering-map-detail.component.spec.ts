import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { JhiDataUtils } from 'ng-jhipster';

import { CompassTestModule } from '../../../test.module';
import { OrienteeringMapDetailComponent } from 'app/entities/orienteering-map/orienteering-map-detail.component';
import { OrienteeringMap } from 'app/shared/model/orienteering-map.model';

describe('Component Tests', () => {
  describe('OrienteeringMap Management Detail Component', () => {
    let comp: OrienteeringMapDetailComponent;
    let fixture: ComponentFixture<OrienteeringMapDetailComponent>;
    let dataUtils: JhiDataUtils;
    const route = ({ data: of({ orienteeringMap: new OrienteeringMap(123) }) } as any) as ActivatedRoute;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [CompassTestModule],
        declarations: [OrienteeringMapDetailComponent],
        providers: [{ provide: ActivatedRoute, useValue: route }],
      })
        .overrideTemplate(OrienteeringMapDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(OrienteeringMapDetailComponent);
      comp = fixture.componentInstance;
      dataUtils = fixture.debugElement.injector.get(JhiDataUtils);
    });

    describe('OnInit', () => {
      it('Should load orienteeringMap on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.orienteeringMap).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });

    describe('byteSize', () => {
      it('Should call byteSize from JhiDataUtils', () => {
        // GIVEN
        spyOn(dataUtils, 'byteSize');
        const fakeBase64 = 'fake base64';

        // WHEN
        comp.byteSize(fakeBase64);

        // THEN
        expect(dataUtils.byteSize).toBeCalledWith(fakeBase64);
      });
    });

    describe('openFile', () => {
      it('Should call openFile from JhiDataUtils', () => {
        // GIVEN
        spyOn(dataUtils, 'openFile');
        const fakeContentType = 'fake content type';
        const fakeBase64 = 'fake base64';

        // WHEN
        comp.openFile(fakeContentType, fakeBase64);

        // THEN
        expect(dataUtils.openFile).toBeCalledWith(fakeContentType, fakeBase64);
      });
    });
  });
});
