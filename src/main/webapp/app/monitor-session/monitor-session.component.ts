/* eslint-disable @typescript-eslint/no-this-alias */
/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
import { HttpResponse } from '@angular/common/http';
import { Component, HostListener, Injectable, OnInit } from '@angular/core';
import { ActivatedRoute, CanDeactivate } from '@angular/router';
import { IPosition } from 'app/shared/model/position.model';
import VectorSource from 'ol/source/Vector';
import { PositionService } from './position.service';
import Map from 'ol/Map';
import { CourseService } from 'app/entities/course/course.service';
import { Course, ICourse } from 'app/shared/model/course.model';
import Point from 'ol/geom/Point';
import { fromLonLat } from 'ol/proj';
import Feature from 'ol/Feature';
import VectorLayer from 'ol/layer/Vector';
import { Fill, Text as OLText, Stroke, Style } from 'ol/style';
import CircleStyle from 'ol/style/Circle';
import TileLayer from 'ol/layer/Tile';
import { XYZ } from 'ol/source';
import { TranslateService } from '@ngx-translate/core';
import { ScaleLine, defaults as defaultControls } from 'ol/control';
import { MapBrowserEvent, View } from 'ol';
import { MessageService } from './message.service';
import { ToastrService } from 'ngx-toastr';
import { interval, Observable, Subscription } from 'rxjs';
import { IMessage } from 'app/shared/model/message.model';
import moment from 'moment';
import { MapServiceService } from 'app/map-service.service';
import { Location } from '@angular/common';

@Injectable()
export class CanDeactivateMonitorGuard implements CanDeactivate<MonitorSessionComponent> {
  canDeactivate(component: MonitorSessionComponent): Observable<boolean> | boolean {
    if (!component.intervalSubscription !== null) {
      component.intervalSubscription.unsubscribe();
    }
    return true;
  }
}

@Component({
  selector: 'jhi-monitor-session',
  templateUrl: './monitor-session.component.html',
  styleUrls: ['./monitor-session.component.scss'],
})
export class MonitorSessionComponent implements OnInit {
  sharedCourseID!: number;
  positions: IPosition[];
  receiver = 'all';
  intervalSubscription: Subscription = null;

  message: string;

  mapHeightOffsetDefault = 450;
  mapHeightOffset = 450;

  courseID: number;
  course: Course;
  courseSource!: VectorSource;
  sourceLines!: VectorSource;
  positionsSource!: VectorSource;
  positionLayer!: VectorLayer;
  positionFeature: Feature;
  map: Map;
  gpxCounter: number;
  colorCodes = [
    '#3cb44b',
    '#ffe119',
    '#4363d8',
    '#f58231',
    '#911eb4',
    '#46f0f0',
    '#f032e6',
    '#e6194b',
    '#bcf60c',
    '#fabebe',
    '#008080',
    '#e6beff',
    '#9a6324',
    '#fffac8',
    '#800000',
    '#aaffc3',
    '#808000',
    '#ffd8b1',
    '#000075',
    '#808080',
    '#ffffff',
    '#000000',
  ];

  initialResolution: number;
  textOffset = 20;
  textSize = 24;
  symbolsFactor = 3;
  stroke = new Stroke({ color: '#bf1377', width: 1 * this.symbolsFactor });

  constructor(
    private route: ActivatedRoute,
    private positionService: PositionService,
    private courseService: CourseService,
    public translate: TranslateService,
    private messageService: MessageService,
    private toastr: ToastrService,
    private location: Location,
    private mapService: MapServiceService
  ) {}

  ngOnInit(): void {
    this.positionsSource = new VectorSource();
    this.sharedCourseID = +this.route.snapshot.paramMap.get('id');
    this.courseID = +this.route.snapshot.paramMap.get('courseID');

    this.courseService.find(this.courseID).subscribe(
      (res: HttpResponse<ICourse>) => {
        this.course = res.body || undefined;
        if (this.course !== undefined) {
          this.setupMap();

          this.mapService.addCourseToMap(this.course, this.map, this.initialResolution, this.courseSource, this.sourceLines);
        }
      },
      error => {
        if (Math.floor(error.status / 100) === 4) {
          // access denied
          this.toastr.error(this.translate.instant('error.accessDeniedGoBack'), this.translate.instant('error.general'), {
            positionClass: 'toast-top-center',
            timeOut: 5000,
          });

          setTimeout(() => {
            this.location.back();
          }, 4000);
        }
      }
    );
    this.fetchPositions();
    this.intervalSubscription = interval(10000).subscribe(() => this.fetchPositions());
  }

  fetchPositions(): void {
    this.positionService.getPositionsForSharedCourse(this.sharedCourseID).subscribe(
      (res: HttpResponse<IPosition[]>) => {
        if (res.body !== undefined) {
          this.positions = res.body;
          this.updatePositions();
        }
      },
      error => {
        if (Math.floor(error.status / 100) === 4) {
          // access denied
          this.toastr.error(this.translate.instant('error.accessDeniedGoBack'), this.translate.instant('error.general'), {
            positionClass: 'toast-top-center',
            timeOut: 5000,
          });

          setTimeout(() => {
            this.location.back();
          }, 4000);
        }
      }
    );
  }

  updatePositions(): void {
    this.positionsSource.clear();
    let strokeColor = '#000';
    let outerRadius = 2;
    let timeDiff = 0;
    for (let i = 0; i < this.positions.length; i++) {
      this.positionFeature = new Feature(new Point(fromLonLat([this.positions[i].longitude, this.positions[i].latitude])));
      this.positionFeature.setId(this.positions[i].uuid);
      timeDiff = moment(new Date()).diff(moment(this.positions[i].timestamp));
      if (timeDiff > 20000) {
        strokeColor = '#aaa';
        outerRadius = 6;
      } else {
        strokeColor = '#000';
        outerRadius = 2;
      }
      this.positionFeature.setStyle(
        new Style({
          image: new CircleStyle({
            radius: 7,
            fill: new Fill({
              color: this.colorCodes[i % 22],
            }),
            stroke: new Stroke({ color: strokeColor, width: outerRadius }),
          }),
          text: new OLText({
            font: this.textSize + 'px Calibri,sans-serif',
            fill: new Fill({ color: '#000' }),
            stroke: new Stroke({ color: '#000', width: 2 }),
            text: this.positions[i].nickname,
            offsetX: 0,
            offsetY: this.textOffset * -1,
          }),
        })
      );
      this.positionsSource.addFeature(this.positionFeature);
    }
  }

  sendMessage(): void {
    if (this.message !== '') {
      const messageObject: IMessage = { uuid: this.receiver, message: this.message, sharedCourseId: this.sharedCourseID };
      if (this.receiver === 'all') messageObject.uuid = null;
      this.messageService.create(messageObject).subscribe(
        () => {
          this.toastr.info('', this.translate.instant('my-courses.message-sent'), {
            positionClass: 'toast-top-center',
            timeOut: 5000,
          });
          this.message = '';
        },
        () => {
          this.toastr.error('', this.translate.instant('error.general'), {
            positionClass: 'toast-top-center',
            timeOut: 5000,
          });
        }
      );
    }
  }

  setupMap(): void {
    const self = this;
    this.courseSource = new VectorSource();
    this.sourceLines = new VectorSource();

    this.positionLayer = new VectorLayer({
      source: this.positionsSource,
      zIndex: 10,
      style: new Style({ stroke: this.stroke }),
    });

    this.map = new Map({
      layers: [
        new TileLayer({
          source: new XYZ({
            url: 'https://{a-c}.tile.opentopomap.org/{z}/{x}/{y}.png',
            maxZoom: 17,
            attributions: this.translate.instant('mapAttribution'),
          }),
          zIndex: 0,
        }),
        new VectorLayer({
          source: this.courseSource,
          zIndex: 2,
        }),
        new VectorLayer({
          source: this.sourceLines,
          zIndex: 3,
        }),
        this.positionLayer,
      ],
      controls: defaultControls().extend([
        new ScaleLine({
          units: 'metric',
          bar: true,
          steps: 4,
          text: false,
          minWidth: 100,
        }),
      ]),
      target: 'map',
      view: new View({
        center: [0, 0],
        zoom: 14,
      }),
    });

    this.map.on('singleclick', function (event: MapBrowserEvent): void {
      if (
        self.map.hasFeatureAtPixel(event.pixel, {
          layerFilter(layer): boolean {
            return layer === self.positionLayer;
          },
          hitTolerance: 3,
        })
      ) {
        // feature clicked --> show popup
        event.map.forEachFeatureAtPixel(
          event.pixel,
          function (feature): void {
            if (typeof feature.getId() !== 'undefined') {
              const tempUUID = feature.getId();

              if (tempUUID !== null && tempUUID !== 0) {
                self.receiver = tempUUID + '';
                document.getElementById('messageField').focus();
              }
            }
          },
          {
            hitTolerance: 3,
          }
        );
      }
    });

    this.initialResolution = this.map.getView().getResolution();

    let currZoom = this.map.getView().getZoom();
    this.map.on('moveend', () => {
      const newZoom = self.map.getView().getZoom();
      if (currZoom !== newZoom) {
        currZoom = newZoom;
        self.sourceLines.clear();
        self.mapService.paintLines(self.course.controlpoints, self.map, self.initialResolution, self.sourceLines);
      }
    });

    this.onResize();
  }

  @HostListener('window:resize', ['$event'])
  onResize(): void {
    if (this.map) {
      let temp = window.innerHeight - this.mapHeightOffset;
      if (temp < 500) temp = 500;
      (document.querySelector('#map') as HTMLElement).style.height = temp + 'px';
      this.map.updateSize();
    }
  }
}
