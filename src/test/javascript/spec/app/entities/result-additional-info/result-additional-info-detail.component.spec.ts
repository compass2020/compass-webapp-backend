import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { JhiDataUtils } from 'ng-jhipster';

import { CompassTestModule } from '../../../test.module';
import { ResultAdditionalInfoDetailComponent } from 'app/entities/result-additional-info/result-additional-info-detail.component';
import { ResultAdditionalInfo } from 'app/shared/model/result-additional-info.model';

describe('Component Tests', () => {
  describe('ResultAdditionalInfo Management Detail Component', () => {
    let comp: ResultAdditionalInfoDetailComponent;
    let fixture: ComponentFixture<ResultAdditionalInfoDetailComponent>;
    let dataUtils: JhiDataUtils;
    const route = ({ data: of({ resultAdditionalInfo: new ResultAdditionalInfo(123) }) } as any) as ActivatedRoute;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [CompassTestModule],
        declarations: [ResultAdditionalInfoDetailComponent],
        providers: [{ provide: ActivatedRoute, useValue: route }],
      })
        .overrideTemplate(ResultAdditionalInfoDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(ResultAdditionalInfoDetailComponent);
      comp = fixture.componentInstance;
      dataUtils = fixture.debugElement.injector.get(JhiDataUtils);
    });

    describe('OnInit', () => {
      it('Should load resultAdditionalInfo on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.resultAdditionalInfo).toEqual(jasmine.objectContaining({ id: 123 }));
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
