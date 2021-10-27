import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { CompassTestModule } from '../../../test.module';
import { ResultAdditionalInfoComponent } from 'app/entities/result-additional-info/result-additional-info.component';
import { ResultAdditionalInfoService } from 'app/entities/result-additional-info/result-additional-info.service';
import { ResultAdditionalInfo } from 'app/shared/model/result-additional-info.model';

describe('Component Tests', () => {
  describe('ResultAdditionalInfo Management Component', () => {
    let comp: ResultAdditionalInfoComponent;
    let fixture: ComponentFixture<ResultAdditionalInfoComponent>;
    let service: ResultAdditionalInfoService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [CompassTestModule],
        declarations: [ResultAdditionalInfoComponent],
      })
        .overrideTemplate(ResultAdditionalInfoComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(ResultAdditionalInfoComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(ResultAdditionalInfoService);
    });

    it('Should call load all on init', () => {
      // GIVEN
      const headers = new HttpHeaders().append('link', 'link;link');
      spyOn(service, 'query').and.returnValue(
        of(
          new HttpResponse({
            body: [new ResultAdditionalInfo(123)],
            headers,
          })
        )
      );

      // WHEN
      comp.ngOnInit();

      // THEN
      expect(service.query).toHaveBeenCalled();
      expect(comp.resultAdditionalInfos && comp.resultAdditionalInfos[0]).toEqual(jasmine.objectContaining({ id: 123 }));
    });
  });
});
