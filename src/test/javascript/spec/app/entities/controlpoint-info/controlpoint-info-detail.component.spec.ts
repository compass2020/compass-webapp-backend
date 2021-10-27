import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { JhiDataUtils } from 'ng-jhipster';

import { CompassTestModule } from '../../../test.module';
import { ControlpointInfoDetailComponent } from 'app/entities/controlpoint-info/controlpoint-info-detail.component';
import { ControlpointInfo } from 'app/shared/model/controlpoint-info.model';

describe('Component Tests', () => {
  describe('ControlpointInfo Management Detail Component', () => {
    let comp: ControlpointInfoDetailComponent;
    let fixture: ComponentFixture<ControlpointInfoDetailComponent>;
    let dataUtils: JhiDataUtils;
    const route = ({ data: of({ controlpointInfo: new ControlpointInfo(123) }) } as any) as ActivatedRoute;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [CompassTestModule],
        declarations: [ControlpointInfoDetailComponent],
        providers: [{ provide: ActivatedRoute, useValue: route }],
      })
        .overrideTemplate(ControlpointInfoDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(ControlpointInfoDetailComponent);
      comp = fixture.componentInstance;
      dataUtils = fixture.debugElement.injector.get(JhiDataUtils);
    });

    describe('OnInit', () => {
      it('Should load controlpointInfo on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.controlpointInfo).toEqual(jasmine.objectContaining({ id: 123 }));
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
