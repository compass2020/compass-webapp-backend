/* eslint-disable @typescript-eslint/no-this-alias */
import { MapServiceService } from './../map-service.service';
import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CourseService } from 'app/entities/course/course.service';
import { Course, ICourse } from 'app/shared/model/course.model';
import { defaults as defaultControls, ScaleLine } from 'ol/control';
import { Style } from 'ol/style';
import Map from 'ol/Map';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import { XYZ } from 'ol/source';
import { View } from 'ol';
import { buffer, createEmpty, extend } from 'ol/extent';
import { TranslateService } from '@ngx-translate/core';
import { fromLonLat } from 'ol/proj';
import { Location } from '@angular/common';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'jhi-print-map',
  templateUrl: './print-map.component.html',
  styleUrls: ['./print-map.component.scss'],
})
export class PrintMapComponent implements OnInit {
  courseID!: number;
  course!: Course;
  map: Map;
  source!: VectorSource;
  sourceLines!: VectorSource;
  printPortrait = true;
  initialResolution: number;

  constructor(
    private route: ActivatedRoute,
    protected courseService: CourseService,
    private translate: TranslateService,
    private location: Location,
    private toastr: ToastrService,
    private mapService: MapServiceService
  ) {}

  ngOnInit(): void {
    this.courseID = +this.route.snapshot.paramMap.get('id');

    if (this.courseID !== undefined) {
      this.loadCourseFromDB(this.courseID);
    }
  }

  loadCourseFromDB(id: number): void {
    this.courseService.find(id).subscribe(
      (res: HttpResponse<ICourse>) => {
        this.course = res.body || undefined;
        if (this.course !== undefined) {
          this.source = new VectorSource();
          this.setupMap();
          /* this.mapService.setupStyles(); */
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

  addCourseToMap(): void {
    this.course.controlpoints.sort((a, b) => (a.sequence > b.sequence ? 1 : -1));

    this.mapService.paintControlPoints(this.course.controlpoints, this.source);

    if (this.course.orienteeringMap.mapOverlayImage !== null) {
      const imageString = this.mapService.createDataURL(
        this.course.orienteeringMap.mapOverlayImageContentType,
        this.course.orienteeringMap.mapOverlayImage
      );

      this.mapService.createGeoImageAndOverlay(
        this.map,
        imageString,
        this.course.orienteeringMap.imageCenterX,
        this.course.orienteeringMap.imageCenterY,
        this.course.orienteeringMap.imageScaleX,
        this.course.orienteeringMap.imageScaleY,
        this.course.orienteeringMap.imageRotation
      );
    }

    if (this.course.orienteeringMap.mapOverlayKml !== null) {
      const kmlString = this.mapService.createDataURL(
        this.course.orienteeringMap.mapOverlayKmlContentType,
        this.course.orienteeringMap.mapOverlayKml
      );
      this.mapService.addKMLtoMap(this.map, kmlString);
    }
  }

  fitMapToCourse(): void {
    let extent = createEmpty();
    this.source.getFeatures().forEach(function (feature): void {
      // add extent of every feature to the extent
      extent = extend(extent, feature.getGeometry().getExtent());
    });
    const width = extent[2] - extent[0];
    const height = extent[3] - extent[1];
    const max = Math.max(width, height);

    extent = buffer(extent, max * 0.15); // add 15% to extent

    this.map.getView().fit(extent);
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

  resize(): void {
    if (this.map) {
      if (this.printPortrait) {
        document.getElementById('map').style.width = '1000px';
        document.getElementById('map').style.height = '1250px';
      } else {
        document.getElementById('map').style.width = '1058px';
        document.getElementById('map').style.height = '600px';
      }
      this.map.updateSize();
      this.sourceLines.clear();
      this.mapService.paintLines(this.course.controlpoints, this.map, this.initialResolution, this.sourceLines);
      this.mapService.fitMapToSource(this.map, this.source);
      setTimeout(() => {
        this.print();
      }, 2000);
    }
  }

  print(): void {
    document.getElementById('map').style.visibility = 'visible';
    (document.getElementsByTagName('jhi-navbar')[0] as HTMLElement).style.display = 'none';
    (document.getElementsByTagName('jhi-footer')[0] as HTMLElement).style.display = 'none';
    document.getElementById('printMenu').style.display = 'none';

    let css;

    if (this.printPortrait) {
      css = '@page { size: portrait; }';
    } else {
      css = '@page { size: landscape; }';
    }

    const head = document.head || document.getElementsByTagName('head')[0];
    const style = document.createElement('style');

    style.type = 'text/css';
    style.media = 'print';
    style.appendChild(document.createTextNode(css));

    head.appendChild(style);

    window.print();
    (document.getElementsByTagName('jhi-navbar')[0] as HTMLElement).style.display = 'inline';
    (document.getElementsByTagName('jhi-footer')[0] as HTMLElement).style.display = 'inline';

    document.getElementById('printMenu').style.display = 'block';
    document.getElementById('map').style.height = '800px';
    document.getElementById('map').style.width = '1000px';
    /* document.getElementById('map').style.visibility = 'hidden'; */
  }
}
