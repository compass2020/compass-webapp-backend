/* eslint-disable @typescript-eslint/no-this-alias */
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Course, ICourse } from 'app/shared/model/course.model';
import { CourseService } from 'app/entities/course/course.service';
import { HttpResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { Location } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { defaults as defaultControls, ScaleLine } from 'ol/control';
import { Style } from 'ol/style';
import Map from 'ol/Map';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import { XYZ } from 'ol/source';
import { View } from 'ol';
import { MapServiceService } from 'app/map-service.service';
import { fromLonLat } from 'ol/proj';

@Component({
  selector: 'jhi-print-qrcodes',
  templateUrl: './print-qrcodes.component.html',
  styleUrls: ['./print-qrcodes.component.scss'],
})
export class PrintQrcodesComponent implements OnInit {
  courseID!: number;
  course!: Course;
  qrcodes!: string[];
  singlePageForOneQR = true;
  map: Map;
  source!: VectorSource;
  sourceLines!: VectorSource;
  initialResolution: number;
  includeMap = true;

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private translate: TranslateService,
    private toastr: ToastrService,
    protected courseService: CourseService,
    private mapService: MapServiceService
  ) {}

  ngOnInit(): void {
    this.courseID = +this.route.snapshot.paramMap.get('id');

    if (this.courseID !== undefined) {
      this.qrcodes = [];
      this.loadCourseFromDB(this.courseID);
    }
  }

  loadCourseFromDB(id: number): void {
    this.courseService.find(id).subscribe(
      (res: HttpResponse<ICourse>) => {
        this.course = res.body || undefined;
        if (this.course !== undefined) {
          this.course.controlpoints.sort((a, b) => (a.sequence > b.sequence ? 1 : -1));
          this.course.controlpoints.forEach(controlpoint => {
            this.qrcodes.push(controlpoint.qrCode);
          });

          document.title = this.course.name;

          // setup map and paint course

          this.setupMap();
          this.mapService.addCourseToMap(this.course, this.map, this.initialResolution, this.source, this.sourceLines);
          this.mapService.fitMapToSource(this.map, this.source);
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

  setupMap(): void {
    this.source = new VectorSource();
    this.sourceLines = new VectorSource();
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
          source: this.source,
          zIndex: 2,
          style: new Style({
            stroke: this.mapService.stroke,
          }),
        }),
        new VectorLayer({
          source: this.sourceLines,
          zIndex: 10,
          style: new Style({
            stroke: this.mapService.stroke,
          }),
        }),
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
        center: fromLonLat([16.2732183, 48.245913]),
        zoom: 14,
        rotation: 0,
      }),
    });

    const self = this;

    let currZoom = this.map.getView().getZoom();
    this.map.on('moveend', () => {
      const newZoom = self.map.getView().getZoom();
      if (currZoom !== newZoom) {
        currZoom = newZoom;
        self.sourceLines.clear();
        self.course.length = self.mapService.paintLines(self.course.controlpoints, self.map, self.initialResolution, self.sourceLines);
      }
    });

    this.initialResolution = this.map.getView().getResolution();
  }

  print(): void {
    this.mapService.fitMapToSource(this.map, this.source);
    // make sure printing mode is portrait
    const css = '@page { size: portrait; }';
    const head = document.head || document.getElementsByTagName('head')[0];
    const style = document.createElement('style');

    style.type = 'text/css';
    style.media = 'print';
    style.appendChild(document.createTextNode(css));

    head.appendChild(style);

    /* document.getElementById('printButton').style.display = 'none';
    document.getElementById('slide-toggle').style.display = 'none';*/
    document.getElementById('logo').style.display = 'block';
    (document.getElementsByTagName('jhi-navbar')[0] as HTMLElement).style.display = 'none';
    (document.getElementsByTagName('jhi-footer')[0] as HTMLElement).style.display = 'none';
    document.getElementById('printMenu').style.display = 'none';

    if (this.singlePageForOneQR) {
      document.getElementById('big_layout').style.display = 'block';
      document.getElementById('big_logo').style.display = 'block';
      document.getElementById('small_layout').style.display = 'none';
    } else {
      document.getElementById('big_layout').style.display = 'none';
      document.getElementById('small_layout').style.display = 'block';
    }

    window.print();

    /* document.getElementById('printButton').style.display = 'block';
    document.getElementById('slide-toggle').style.display = 'block'; */
    document.getElementById('logo').style.display = 'none';
    (document.getElementsByTagName('jhi-navbar')[0] as HTMLElement).style.display = 'inline';
    (document.getElementsByTagName('jhi-footer')[0] as HTMLElement).style.display = 'inline';

    document.getElementById('big_layout').style.display = 'none';
    document.getElementById('big_logo').style.display = 'none';
    document.getElementById('small_layout').style.display = 'block';
    document.getElementById('printMenu').style.display = 'block';
  }
}
