import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IOrienteeringMap } from 'app/shared/model/orienteering-map.model';
import { OrienteeringMapService } from './orienteering-map.service';

@Component({
  templateUrl: './orienteering-map-delete-dialog.component.html',
})
export class OrienteeringMapDeleteDialogComponent {
  orienteeringMap?: IOrienteeringMap;

  constructor(
    protected orienteeringMapService: OrienteeringMapService,
    public activeModal: NgbActiveModal,
    protected eventManager: JhiEventManager
  ) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.orienteeringMapService.delete(id).subscribe(() => {
      this.eventManager.broadcast('orienteeringMapListModification');
      this.activeModal.close();
    });
  }
}
