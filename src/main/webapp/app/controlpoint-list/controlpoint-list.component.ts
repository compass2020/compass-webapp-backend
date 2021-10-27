import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Controlpoint } from 'app/shared/model/controlpoint.model';

@Component({
  selector: 'jhi-controlpoint-list',
  templateUrl: './controlpoint-list.component.html',
  styleUrls: ['./controlpoint-list.component.scss'],
})
export class ControlpointListComponent implements OnInit {
  @Input() controlpoints: Controlpoint[];
  @Output() controlpointsChange = new EventEmitter();
  @Output() removeAltitude = new EventEmitter();

  constructor() {}

  ngOnInit(): void {}

  removeControlpoint(id: number): void {
    this.controlpoints.splice(id, 1);
    for (let i = id; i < this.controlpoints.length; i++) {
      this.controlpoints[i].sequence--;
    }
    this.removeAltitude.emit(id);
    this.controlpointsChange.emit(this.controlpoints);
  }

  clearCourse(): void {
    this.controlpoints = [];
    this.controlpointsChange.emit(this.controlpoints);
  }

  skipValueChange($event: any, index: any): void {
    this.controlpoints[index].skippable = $event.checked;
    // this.controlpoints[index].skipConditionTime = 60;
    this.controlpoints[index].team = false;

    this.controlpointsChange.emit(this.controlpoints);
  }

  /* skipValueChange(cpIndex: number, $event: any): void {
    this.controlpoints[cpIndex].skippable = $event.target.checked;
    this.controlpointsChange.emit(this.controlpoints);
  } */
}
