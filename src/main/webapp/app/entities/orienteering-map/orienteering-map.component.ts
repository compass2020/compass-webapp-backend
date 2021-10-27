import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { JhiEventManager, JhiDataUtils } from 'ng-jhipster';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IOrienteeringMap, OrienteeringMap } from 'app/shared/model/orienteering-map.model';
import { OrienteeringMapService } from './orienteering-map.service';
import { OrienteeringMapDeleteDialogComponent } from './orienteering-map-delete-dialog.component';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';

@Component({
  selector: 'jhi-orienteering-map',
  templateUrl: './orienteering-map.component.html',
})
export class OrienteeringMapComponent implements OnInit, OnDestroy {
  orienteeringMaps?: IOrienteeringMap[];
  eventSubscriber?: Subscription;
  totalItems = 0;
  itemsPerPage = 5;
  page!: number;
  firstCall = true;
  predicate!: string;
  previousPage!: number;
  ascending!: boolean;

  constructor(
    protected orienteeringMapService: OrienteeringMapService,
    protected dataUtils: JhiDataUtils,
    protected eventManager: JhiEventManager,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    protected modalService: NgbModal
  ) {}

  loadAll(): void {
    this.orienteeringMapService
      .query({
        page: this.page - 1,
        size: this.itemsPerPage,
        sort: this.sort(),
      })
      .subscribe((res: HttpResponse<OrienteeringMap[]>) => this.onSuccess(res.body, res.headers));
  }

  ngOnInit(): void {
    this.predicate = 'id';
    this.ascending = false;
    this.page = 1;
    this.loadAll();
    this.registerChangeInOrienteeringMaps();
  }

  ngOnDestroy(): void {
    if (this.eventSubscriber) {
      this.eventManager.destroy(this.eventSubscriber);
    }
  }

  trackId(index: number, item: IOrienteeringMap): number {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    return item.id!;
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(contentType = '', base64String: string): void {
    return this.dataUtils.openFile(contentType, base64String);
  }

  registerChangeInOrienteeringMaps(): void {
    this.eventSubscriber = this.eventManager.subscribe('orienteeringMapListModification', () => this.loadAll());
  }

  delete(orienteeringMap: IOrienteeringMap): void {
    const modalRef = this.modalService.open(OrienteeringMapDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.orienteeringMap = orienteeringMap;
  }

  loadPage(page: number): void {
    this.firstCall = false;
    this.previousPage = page;
    this.transition();
  }

  handleBackNavigation(): void {
    this.activatedRoute.queryParamMap.subscribe((params: ParamMap) => {
      if (!this.firstCall) {
        let prevPage = params.get('page');
        if (prevPage === null) {
          prevPage = '1'; // because there are no params in the URL the first time /admin/user-management
        }
        const prevSort = params.get('sort');
        const prevSortSplit = prevSort?.split(',');
        if (prevSortSplit) {
          this.predicate = prevSortSplit[0];
          this.ascending = prevSortSplit[1] === 'asc';
        } else {
          this.predicate = 'id';
          this.ascending = true;
        }
        if (+prevPage !== this.page) {
          this.page = +prevPage;
        }
        this.loadPage(this.page);
      }
    });
  }

  transition(): void {
    this.firstCall = false;
    this.router.navigate(['./'], {
      relativeTo: this.activatedRoute.parent,
      queryParams: {
        page: this.page,
        sort: this.predicate + ',' + (this.ascending ? 'asc' : 'desc'),
      },
    });
    this.loadAll();
  }

  private sort(): string[] {
    const result = [this.predicate + ',' + (this.ascending ? 'asc' : 'desc')];
    if (this.predicate !== 'id') {
      result.push('id');
    }
    return result;
  }

  private onSuccess(orienteeringMaps: OrienteeringMap[] | null, headers: HttpHeaders): void {
    this.totalItems = Number(headers.get('X-Total-Count'));
    this.orienteeringMaps = orienteeringMaps;
  }
}
