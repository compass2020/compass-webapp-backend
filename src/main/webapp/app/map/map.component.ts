import { MapServiceService } from './../map-service.service';
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
/* eslint-disable @typescript-eslint/tslint/config */
import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import Map from 'ol/Map';
import View from 'ol/View';
import { Modify } from 'ol/interaction';
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer';
import { Vector as VectorSource, XYZ } from 'ol/source';
import { Circle as CircleStyle, Style } from 'ol/style';
import { fromLonLat } from 'ol/proj';
import { transform } from 'ol/proj';
import Point from 'ol/geom/Point';
import Feature from 'ol/Feature';
import Collection from 'ol/Collection';
import Geometry from 'ol/geom/Geometry';
import Overlay from 'ol/Overlay';
import { defaults as defaultControls, FullScreen, ScaleLine } from 'ol/control';
import { HostListener } from '@angular/core';
import { Controlpoint } from 'app/shared/model/controlpoint.model';
import { createEmpty, extend, buffer, getCenter } from 'ol/extent';
import { Coordinate } from 'ol/coordinate';
import Projection from 'ol/proj/Projection';
import GeoImage from 'ol-ext/source/GeoImage';
import ImageLayer from 'ol/layer/Image';
import { Subscription } from 'rxjs/internal/Subscription';
import { ElevationService } from 'app/elevation.service';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const geomagnetism = require('geomagnetism');

// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
import ApexCharts, { ApexOptions } from 'apexcharts';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import * as Geocoder from 'ol-geocoder';
import { ICourse } from 'app/shared/model/course.model';

@Component({
  selector: 'jhi-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements OnInit {
  /* @Input() controlpoints: Controlpoint[]; */
  @Input() expertMode: boolean;
  @Input() course: ICourse;
  @Output() courseChange = new EventEmitter();
  @Output() downloadFinished = new EventEmitter();

  subsVar: Subscription | undefined;

  chartOptions!: ApexOptions;
  chart!: ApexCharts;
  altitudeArr!: number[];

  map!: Map;
  source!: VectorSource;
  sourceLines!: VectorSource;
  vectorlayer!: VectorLayer;
  vectorlayer2!: VectorLayer;
  tilelayer!: TileLayer;
  satelliteLayer!: TileLayer;
  controlpointTemp!: Controlpoint;
  pointCollection = new Collection<Feature<Geometry>>();
  modify!: Modify;
  /* courseLength!: number; */
  modifiedFeature!: Feature;
  overlayPopUpBig!: Overlay;
  popUpContainer!: HTMLElement | null;
  popUpID!: number;
  teamControlpointPopUp!: boolean;
  skipControlpointPopUp!: boolean;
  skipDisabled!: boolean;
  teamDisabled!: boolean;
  radiusPopUp!: number;
  latPopUp!: string;
  lonPopUp!: string;
  screenWidth!: number;
  screenHeight!: number;
  mapHeightOffset!: number;
  minimumMapHeight = 500;
  mapHeightOffsetDefault!: number;

  initialResolution: number;

  overlayInProgress = false;
  overlayImageIsActive = false;
  overlayImgAsString!: string;
  alignmentMapCoords!: Coordinate[];
  alignmentImgCoords!: Coordinate[];
  imgMap!: Map;
  imgMapVectorSource!: VectorSource;
  imgMapVectorLayer!: VectorLayer;
  alignmentVectorSource!: VectorSource;
  alignmentVectorLayer!: VectorLayer;
  geoImage!: GeoImage;
  extentArray: [number, number, number, number];

  /* scale!: number[]; // Scale of Overlay Image
  rotation!: number; // Rotation of Overlay Image
  center!: number[]; // Center of Overlay Image */
  decliation!: number; // Declination for start location
  /* mapFinalString!: string; // base64 String of final Map incl. Overlays and Controlpoints
  mapFinalBlob!: any; */
  mapFinalSmallString!: string; // base64 String of final Map incl. Overlays and Controlpoints
  mapFinalSmallBlob!: any;
  kmlString!: string; // base64 String of uploaded KML
  kmlOverlayIsActive = false;
  geoImageLayer!: ImageLayer;
  kmlLayer!: VectorLayer;
  widthBeforePrint!: string;
  zoomTemp!: number;

  constructor(
    private elevationService: ElevationService,
    private translate: TranslateService,
    private toastr: ToastrService,
    private mapService: MapServiceService
  ) {
    this.onResize();
  }

  ngOnInit(): void {
    // this.mapService.setupStyles();
    this.mapHeightOffsetDefault = 373;
    this.mapHeightOffset = this.mapHeightOffsetDefault;
    /* this.course.length = 0; */
    this.alignmentImgCoords = [];
    this.alignmentMapCoords = [];
    this.altitudeArr = [];

    this.tilelayer = new TileLayer({
      source: new XYZ({
        url: 'https://{a-c}.tile.opentopomap.org/{z}/{x}/{y}.png',
        crossOrigin: 'Anonymous',
        maxZoom: 17,
        attributions: this.translate.instant('mapAttribution'),
      }),
    });
    this.satelliteLayer = new TileLayer({
      source: new XYZ({
        url: 'https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        crossOrigin: 'Anonymous',
        maxZoom: 17,
        attributions: this.translate.instant('mapAttributionSatellite'),
      }),
    });
    this.tilelayer.setZIndex(0);
    this.satelliteLayer.setZIndex(0);
    this.satelliteLayer.setVisible(false);

    this.source = new VectorSource();
    this.sourceLines = new VectorSource();
    this.vectorlayer = new VectorLayer({
      source: this.source,
      style: new Style({
        stroke: this.mapService.stroke,
      }),
    });
    this.vectorlayer2 = new VectorLayer({
      source: this.sourceLines,
      style: new Style({
        stroke: this.mapService.stroke,
      }),
    });
    this.vectorlayer.setZIndex(10);
    this.vectorlayer2.setZIndex(10);

    this.alignmentVectorSource = new VectorSource();
    this.alignmentVectorLayer = new VectorLayer({
      source: this.alignmentVectorSource,
      style: new Style({
        image: new CircleStyle({
          radius: 10,
          stroke: this.mapService.stroke,
        }),
      }),
    });
  }

  ngAfterViewInit(): void {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const self = this;

    /**
     * Elements that make up the popup.
     */
    this.popUpContainer = document.getElementById('popup');
    // this.popUpTeamCheckbox = document.getElementById('popup-team');
    const closer = document.getElementById('popup-closer');

    if (this.popUpContainer !== null) {
      /**
       * Create an overlay to anchor the popup to the map.
       */
      this.overlayPopUpBig = new Overlay({
        element: this.popUpContainer,
        autoPan: true,
        autoPanAnimation: {
          duration: 250,
        },
      });
    }

    if (closer !== null) {
      /**
       * Add a click handler to hide the popup.
       * @return {boolean} Don't follow the href.
       */
      closer.onclick = function () {
        self.overlayPopUpBig.setPosition(undefined);
        closer.blur();
        return false;
      };
    }

    const geocoder = new Geocoder('nominatim', {
      provider: 'osm',
      lang: 'en', // en-US, fr-FR
      preventDefault: true,
      autoComplete: true,
      placeholder: this.translate.instant('searchAndOrder.searchFor'),
      targetType: 'text-input',
      limit: 5,
      keepOpen: false,
    });

    geocoder.on('addresschosen', function (evt) {
      self.map.getView().animate({
        center: evt.coordinate,
        zoom: Math.max(self.map.getView().getZoom(), 15),
      });
    });

    const fullscreen = new FullScreen({
      source: 'fullscreen',
    });
    fullscreen.on('enterfullscreen', function () {
      self.mapHeightOffset = 0;
      self.onResize();
    });
    fullscreen.on('leavefullscreen', function () {
      self.mapHeightOffset = self.mapHeightOffsetDefault;
      self.onResize();
    });

    this.map = new Map({
      layers: [this.tilelayer, this.satelliteLayer, this.vectorlayer, this.vectorlayer2],
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
    this.initialResolution = this.map.getView().getResolution();
    this.map.getView().setMaxZoom(19); // OpenTopoMap maximum 17, but allow user to scroll further

    this.map.addControl(geocoder);
    this.map.addControl(fullscreen);
    this.map.on('singleclick', function (event) {
      if (!self.overlayInProgress) {
        // check if click is on a feature
        if (
          self.map.hasFeatureAtPixel(event.pixel, {
            layerFilter(layer) {
              return layer === self.vectorlayer;
            },
            hitTolerance: 10,
          })
        ) {
          // feature clicked --> show popup
          event.map.forEachFeatureAtPixel(
            event.pixel,
            function (feature) {
              if (typeof feature.getId() !== 'undefined') {
                const cpIndex = feature.getId() as number;

                if (cpIndex != null) {
                  self.updatePopUp(cpIndex);
                  self.popUpID = cpIndex;
                }
                self.overlayPopUpBig.setPosition(
                  transform(
                    [self.course.controlpoints[cpIndex].longitude!, self.course.controlpoints[cpIndex].latitude!],
                    'EPSG:4326',
                    'EPSG:3857'
                  )
                );
              }
            },
            {
              hitTolerance: 10,
            }
          );
        } else {
          // add new Controlpoint
          const lonlat = transform(event.coordinate, 'EPSG:3857', 'EPSG:4326');
          self.addControlpoint(lonlat);
        }
      } else {
        if (self.alignmentMapCoords.length < 2) {
          self.alignmentMapCoords.push(event.coordinate);

          const point = new Point(event.coordinate);
          const featurePoint = new Feature({
            geometry: point,
          });
          self.alignmentVectorSource.addFeature(featurePoint);

          self.overlayImgOnMap();
        } else {
          self.toastr.info('', self.translate.instant('create-course.alreadyTwoPointsForAlignment'), {
            positionClass: 'toast-top-center',
            timeOut: 5000,
          });
        }
      }
    });

    this.onResize();

    let currZoom = this.map.getView().getZoom();
    this.map.on('moveend', () => {
      const newZoom = self.map.getView().getZoom();
      if (currZoom !== newZoom) {
        currZoom = newZoom;
        self.sourceLines.clear();
        self.course.length = self.mapService.paintLines(self.course.controlpoints, self.map, self.initialResolution, self.sourceLines);
      }
    });

    this.chartOptions = {
      chart: {
        type: 'line',
        height: '40%',
      },
      dataLabels: {
        enabled: false,
      },
      series: [],
      noData: {
        text: this.translate.instant('create-course.addCPtoSeeAltitude'),
      },
      yaxis: [
        {
          opposite: true,
          title: {
            text: this.translate.instant('results.altitude'),
          },
          decimalsInFloat: 0,
        },
      ],
      markers: {
        size: [7],
      },
      stroke: {
        curve: 'smooth',
      },
      xaxis: {
        type: 'category',
        categories: [],
      },
    };

    this.chart = new ApexCharts(document.querySelector('#chart'), this.chartOptions);
    this.chart.render();
  }

  calcAltitudeSum(): void {
    this.course.altitudeUp = 0;
    this.course.altitudeDown = 0;

    for (let i = 1; i < this.altitudeArr.length; i++) {
      if (this.altitudeArr[i] > this.altitudeArr[i - 1])
        // up
        this.course.altitudeUp += (this.altitudeArr[i] as number) - (this.altitudeArr[i - 1] as number);
      // down
      else this.course.altitudeDown += (this.altitudeArr[i - 1] as number) - (this.altitudeArr[i] as number);
    }
  }

  changeFromList($event): void {
    this.course.controlpoints = $event;
    this.courseChange.emit(this.course);
    this.paintControlpointsOnMap();
    this.setAltitudeArr();
    this.drawAltitudeChart();
  }

  removeFromAltitudeArr($event): void {
    this.altitudeArr.splice($event, 1);
  }

  centerMyLocation(): void {
    if (window.navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => {
          const longitude = position.coords.longitude;
          const latitude = position.coords.latitude;

          this.setCenterOfMapToGeolocation(longitude, latitude);
        },
        error => {
          console.log(error);
        }
      );
    } else {
      console.log('No support for geolocation');
    }
  }

  toggleTileLayer(): void {
    if (this.tilelayer.getVisible()) {
      this.tilelayer.setVisible(false);
      this.satelliteLayer.setVisible(true);
      document.getElementById('toggleLayerButton').innerHTML = this.translate.instant('create-course.changeToOpenStreetMap');
    } else {
      this.tilelayer.setVisible(true);
      this.satelliteLayer.setVisible(false);
      document.getElementById('toggleLayerButton').innerHTML = this.translate.instant('create-course.changeToSatellite');
    }
  }

  openSearchBar(): void {
    document.getElementById('gcd-input-query').focus();
  }

  setCenterOfMapToGeolocation(longitude: number, latitude: number): void {
    this.map.getView().setCenter(fromLonLat([longitude, latitude]));
  }

  getDeclination(): number {
    if (this.course.controlpoints.length > 0) {
      const info = geomagnetism.model().point([this.course.controlpoints[0].latitude, this.course.controlpoints[0].longitude]);
      return info.decl;
    }
  }

  /* getDeclinationAndRotate(): void {
    if (this.course.controlpoints.length > 0) {
      const info = geomagnetism.model().point([this.course.controlpoints[0].latitude, this.course.controlpoints[0].longitude]);
      console.log(info);
      this.decliation = info.decl;
      const rotationInRadiant = Math.round((info.decl / 180) * Math.PI * 1000) / 1000;
      alert('declination: ' + info.decl + '° ; in rad: ' + rotationInRadiant);
      this.map.getView().setRotation(rotationInRadiant);
    } else {
      this.map.getView().setRotation(0);
    }
  } */

  updatePopUp(index: number): void {
    this.latPopUp = this.course.controlpoints[index].latitude.toFixed(4);
    this.lonPopUp = this.course.controlpoints[index].longitude.toFixed(4);
    if (index > 0) {
      this.teamDisabled = false;
      this.teamControlpointPopUp = this.course.controlpoints[index].team;
    } else {
      this.teamDisabled = true;
      this.teamControlpointPopUp = false;
    }

    if (index > 1 && index !== this.course.controlpoints.length - 1) {
      this.skipDisabled = false;
      this.skipControlpointPopUp = this.course.controlpoints[index].skippable;
    } else {
      this.skipDisabled = true;
      this.skipControlpointPopUp = false;
    }
    this.radiusPopUp = this.course.controlpoints[index].radius;
  }

  setAltitudeArr(): void {
    this.altitudeArr = [];
    for (let i = 0; i < this.course.controlpoints?.length; i++) {
      if (this.course.controlpoints[i].elevation !== 0) {
        this.altitudeArr[i] = this.course.controlpoints[i].elevation;
      } else {
        this.elevationService.getElevation(this.course.controlpoints[i]).subscribe(response => {
          if (response !== null) {
            this.altitudeArr[i] = response.body.data[0];
            this.course.controlpoints[i].elevation = response.body.data[0];
            this.calcAltitudeSum();
            this.drawAltitudeChart();
            this.courseChange.emit(this.course);
          }
        });
      }
    }

    this.calcAltitudeSum();
  }

  drawAltitudeChart(): void {
    const categoryArr = [];
    for (let i = 1; i < this.course.controlpoints?.length - 1; i++) {
      categoryArr[i] = 'CP #' + i;
    }

    categoryArr[0] = this.translate.instant('create-course.start');
    if (this.course.controlpoints?.length > 1)
      categoryArr[this.course.controlpoints.length - 1] = this.translate.instant('create-course.finish');

    this.chartOptions = {
      ...this.chartOptions,
      ...{
        xaxis: {
          categories: categoryArr,
        },
      },
    };
    this.chart.updateOptions(this.chartOptions);
    this.chart.updateSeries([{ name: this.translate.instant('results.altitude'), type: 'line', data: this.altitudeArr }], false);
  }

  paintControlpointsOnMap(): void {
    this.source.clear();
    this.map.getOverlays().clear();
    this.overlayPopUpBig.setPosition(undefined);
    this.map.addOverlay(this.overlayPopUpBig);

    this.map.removeInteraction(this.modify);

    this.pointCollection = this.mapService.paintControlPoints(this.course.controlpoints, this.source);

    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const self = this;
    this.pointCollection.forEach(featurePoint => {
      featurePoint.getGeometry().on('change', () => {
        self.modifiedFeature = featurePoint;
      });
    });

    this.modify = new Modify({ features: this.pointCollection });

    this.modify.on('modifyend', () => {
      const lonlat = transform((this.modifiedFeature.getGeometry() as Point).getCoordinates(), 'EPSG:3857', 'EPSG:4326');
      this.course.controlpoints[this.modifiedFeature.getId() as number].longitude = lonlat[0];
      this.course.controlpoints[this.modifiedFeature.getId() as number].latitude = lonlat[1];
      this.paintControlpointsOnMap();

      this.elevationService.getElevation(this.course.controlpoints[this.modifiedFeature.getId() as number]).subscribe(response => {
        if (response !== null) {
          this.altitudeArr[this.modifiedFeature.getId() as number] = response.body.data[0];
          this.calcAltitudeSum();
          this.drawAltitudeChart();
          this.course.controlpoints[this.modifiedFeature.getId() as number].elevation = response.body.data[0];
          this.courseChange.emit(this.course);
        }
      });

      this.courseChange.emit(this.course);
    });
    this.map.addInteraction(this.modify);
    this.onResize();
    this.sourceLines.clear();
    this.course.length = this.mapService.paintLines(this.course.controlpoints, this.map, this.initialResolution, this.sourceLines);
  }

  addControlpoint(lonlat: Coordinate): void {
    this.controlpointTemp = {
      sequence: this.course.controlpoints.length,
      longitude: lonlat[0],
      latitude: lonlat[1],
      team: false,
      skippable: false,
      radius: 15,
      questions: [],
      controlpointInfos: [],
    };

    this.elevationService.getElevation(this.controlpointTemp).subscribe(response => {
      if (response !== null) {
        this.altitudeArr.push(response.body.data[0]);
        this.calcAltitudeSum();
        this.drawAltitudeChart();
        this.controlpointTemp.elevation = response.body.data[0];
        this.courseChange.emit(this.course);
      }
    });

    this.course.controlpoints.push(this.controlpointTemp);
    this.courseChange.emit(this.course);
    this.paintControlpointsOnMap();
  }

  addControlpointFromCoords(): void {
    const entered = (document.getElementById('enteredLatLon') as HTMLInputElement).value;

    let successfull = false;
    if (entered !== '') {
      const lat = entered.split(',')[0];
      const lon = entered.split(',')[1];
      if (!isNaN(Number(lon)) && !isNaN(Number(lat))) {
        const lonlat = [Number(lon), Number(lat)];
        this.addControlpoint(lonlat);
        this.fitMapToFeatures();

        successfull = true;
      }
    }

    if (!successfull) {
      this.toastr.warning('', this.translate.instant('create-course.coordinateFormatWrong'), {
        positionClass: 'toast-top-center',
        timeOut: 5000,
      });
    }
  }

  skipValueChange($event: any) {
    this.course.controlpoints[this.popUpID].skippable = $event.checked;
    this.skipControlpointPopUp = $event.checked;
    this.sourceLines.clear();
    this.course.length = this.mapService.paintLines(this.course.controlpoints, this.map, this.initialResolution, this.sourceLines);
    this.overlayPopUpBig.setPosition(
      transform(
        [this.course.controlpoints[this.popUpID].longitude!, this.course.controlpoints[this.popUpID].latitude!],
        'EPSG:4326',
        'EPSG:3857'
      )
    );
  }

  radiusValueChange($event: any) {
    this.course.controlpoints[this.popUpID].radius = $event.value;
    this.radiusPopUp = $event.value;
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.screenHeight = window.innerHeight;
    this.screenWidth = window.innerWidth;

    if (this.map) {
      if ((document.querySelector('#map') as HTMLElement) !== undefined) {
        if (this.screenHeight - this.mapHeightOffset > this.minimumMapHeight)
          (document.querySelector('#map') as HTMLElement).style.height = this.screenHeight - this.mapHeightOffset + 'px';
        else (document.querySelector('#map') as HTMLElement).style.height = this.minimumMapHeight + 'px';
        this.map.updateSize();
      }
    }

    if (this.imgMap) {
      if (this.overlayInProgress)
        if (this.screenHeight - this.mapHeightOffset > this.minimumMapHeight)
          (document.querySelector('#imgMap') as HTMLElement).style.height = this.screenHeight - this.mapHeightOffset + 'px';
        else (document.querySelector('#imgMap') as HTMLElement).style.height = this.minimumMapHeight + 'px';
      else {
        (document.querySelector('#imgMap') as HTMLElement).style.height = '0px';
        (document.querySelector('#imgMap') as HTMLElement).style.width = '0px';
      }
      this.imgMap.updateSize();
    }
  }

  downloadMap() {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const self = this;
    this.mapService.symbolsFactor = 5;
    this.mapService.textOffset = 34;
    this.mapService.textSize = 40;
    this.mapService.offsetValue = 180;
    this.mapService.setupStyles();
    this.paintControlpointsOnMap();

    this.map.once('rendercomplete', function () {
      const mapCanvas = document.createElement('canvas');
      const size = self.map.getSize();
      mapCanvas.width = size[0];
      mapCanvas.height = size[1];
      const mapContext = mapCanvas.getContext('2d');
      Array.prototype.forEach.call(document.querySelectorAll('#map .ol-layer canvas'), function (canvas) {
        if (canvas.width > 0) {
          const opacity = canvas.parentNode.style.opacity;
          if (mapContext !== null) {
            mapContext.globalAlpha = opacity === '' ? 1 : Number(opacity);
          }
          const transformCanvas = canvas.style.transform;
          // Get the transform parameters from the style's transform matrix
          const matrix = transformCanvas
            .match(/^matrix\(([^(]*)\)$/)[1]
            .split(',')
            .map(Number);
          // Apply the transform to the export map context
          CanvasRenderingContext2D.prototype.setTransform.apply(mapContext, matrix);
          mapContext?.drawImage(canvas, 0, 0);
        }
      });
      /*
      self.mapFinalString = mapCanvas.toDataURL('image/jpeg', 0.8);
      self.mapFinalBlob = self.mapFinalString.substr(23); // cutoff beginning with "data:image/jpeg;base64," */

      // Set map to small image size and repeat process

      self.mapService.symbolsFactor = 4;
      self.mapService.textOffset = 25;
      self.mapService.textSize = 30;
      self.mapService.offsetValue = 350;
      self.mapService.setupStyles();
      self.paintControlpointsOnMap();
      (document.querySelector('#map') as HTMLElement).style.height = '400px';
      (document.querySelector('#map') as HTMLElement).style.width = '400px';

      self.map.updateSize();

      self.fitMapToFeatures();

      self.map.once('rendercomplete', function () {
        const mapCanvas2 = document.createElement('canvas');
        const size2 = self.map.getSize();
        mapCanvas2.width = size2[0];
        mapCanvas2.height = size2[1];
        const mapContext2 = mapCanvas2.getContext('2d');
        Array.prototype.forEach.call(document.querySelectorAll('#map .ol-layer canvas'), function (canvas) {
          if (canvas.width > 0) {
            const opacity = canvas.parentNode.style.opacity;
            if (mapContext2 !== null) {
              mapContext2.globalAlpha = opacity === '' ? 1 : Number(opacity);
            }
            const transformCanvas = canvas.style.transform;
            // Get the transform parameters from the style's transform matrix
            const matrix = transformCanvas
              .match(/^matrix\(([^(]*)\)$/)[1]
              .split(',')
              .map(Number);
            // Apply the transform to the export map context
            CanvasRenderingContext2D.prototype.setTransform.apply(mapContext2, matrix);
            mapContext2?.drawImage(canvas, 0, 0);
          }
        });

        self.mapFinalSmallString = mapCanvas2.toDataURL('image/jpeg', 0.8);
        self.mapFinalSmallBlob = self.mapFinalSmallString.substr(23); // cutoff beginning with "data:image/jpeg;base64,"

        if (self.zoomTemp !== undefined) self.map.getView().setZoom(self.zoomTemp);
        self.mapService.symbolsFactor = 3;
        self.mapService.textOffset = 20;
        self.mapService.textSize = 24;
        self.mapService.offsetValue = 110;
        self.mapService.setupStyles();
        self.paintControlpointsOnMap();

        self.courseChange.emit(self.course);
        self.downloadFinished.emit();
        /* self.downloadFinishedEventEmitter.emit(); */
      });

      self.map.renderSync();
    });

    if (this.map) {
      this.zoomTemp = this.map.getView().getZoom();
      this.widthBeforePrint = document.getElementById('map').style.width;
      (document.querySelector('#map') as HTMLElement).style.height = '1000px';
      (document.querySelector('#map') as HTMLElement).style.width = '1000px';

      this.map.updateSize();

      this.fitMapToFeatures();
    }

    this.vectorlayer.getSource().on('tileloadend', function () {
      self.map.renderSync();
    });
  }

  fitMapToFeatures(): void {
    let extent = createEmpty();
    this.vectorlayer
      .getSource()
      .getFeatures()
      .forEach(function (feature) {
        // add extent of every feature to the extent
        extent = extend(extent, feature.getGeometry().getExtent());
      });
    const width = extent[2] - extent[0];
    const height = extent[3] - extent[1];
    const max = Math.max(width, height);

    extent = buffer(extent, max * 0.15); // add 15% to extent

    this.map.getView().fit(extent);
  }

  setZoomLevelToMax(): void {
    const zoomLevel = this.map.getView().getZoom();
    if (zoomLevel >= 18) this.map.getView().setZoom(17);
  }

  kmlUpload(fileInputEvent: any): void {
    const file = fileInputEvent.target.files[0];

    const filesize = file.size / 1024 / 1024;
    if (filesize < 3) {
      // eslint-disable-next-line @typescript-eslint/no-this-alias
      const self = this;
      const reader = new FileReader();
      reader.onload = function () {
        self.kmlString = reader.result as string;
        self.addKMLtoMap();
      };
      reader.readAsDataURL(file);
    } else {
      this.toastr.warning('', this.translate.instant('create-course.kmlTooBig'), {
        positionClass: 'toast-top-center',
        timeOut: 5000,
      });
    }
    event.preventDefault();
  }

  removeKMLfromMap(): void {
    this.map.removeLayer(this.kmlLayer);
    this.kmlString = null;
    this.kmlOverlayIsActive = false;
  }

  addKMLtoMap(): void {
    this.kmlLayer = this.mapService.addKMLtoMap(this.map, this.kmlString);

    this.kmlOverlayIsActive = true;
  }

  imgOverlay(imgOverlayEvent: any): void {
    const file = imgOverlayEvent.target.files[0];
    const filesize = file.size / 1024 / 1024;
    if (filesize < 5) {
      document.getElementById('imgMap').classList.add('imgAligningMap');
      document.getElementById('map').classList.add('imgAligningMap');
      this.alignmentMapCoords = [];
      this.alignmentVectorSource = new VectorSource();
      this.alignmentVectorLayer.setSource(this.alignmentVectorSource);
      this.map.removeLayer(this.geoImageLayer);
      this.vectorlayer.setVisible(false);
      this.vectorlayer2.setVisible(false);

      this.zoomTemp = this.map.getView().getZoom();

      this.overlayInProgress = true;
      this.map.addLayer(this.alignmentVectorLayer);

      // eslint-disable-next-line @typescript-eslint/no-this-alias
      const self = this;
      const reader = new FileReader();
      reader.onload = function () {
        // Create a new image to get the size.
        const img = new Image();
        // Set the img src property using the data URL.
        img.addEventListener('load', function () {
          // self.extentArray = [0, 0, this.naturalWidth, this.naturalHeight];
          self.extentArray = [-this.naturalWidth / 2, -this.naturalHeight / 2, this.naturalWidth / 2, this.naturalHeight / 2];
          const projectionObj = new Projection({
            code: 'pixel',
            units: 'pixels',
            extent: self.extentArray,
          });

          self.overlayImgAsString = reader.result as string;

          document.getElementById('imgMap').innerHTML = '';
          self.alignmentImgCoords = [];
          self.imgMapVectorSource = new VectorSource();
          self.imgMapVectorLayer = new VectorLayer({
            source: self.imgMapVectorSource,
            style: new Style({
              image: new CircleStyle({
                radius: 10,
                stroke: self.mapService.stroke,
              }),
            }),
          });

          self.imgMap = new Map({
            layers: [
              new ImageLayer({
                source: new GeoImage({ url: reader.result as string, imageCenter: [0, 0], imageScale: [1, 1], projection: projectionObj }),
              }),
              self.imgMapVectorLayer,
            ],
            target: 'imgMap',
            view: new View({
              projection: projectionObj,
              center: getCenter(self.extentArray),
              zoom: 1,
            }),
          });

          self.imgMap.on('singleclick', function (event) {
            if (self.alignmentImgCoords.length < 2) {
              self.alignmentImgCoords.push(event.coordinate);

              const point = new Point(event.coordinate);
              const featurePoint = new Feature({
                geometry: point,
              });
              self.imgMapVectorSource.addFeature(featurePoint);

              self.overlayImgOnMap();
            } else {
              self.toastr.info('', self.translate.instant('create-course.alreadyTwoPointsForAlignment'), {
                positionClass: 'toast-top-center',
                timeOut: 5000,
              });
            }
          });

          self.toastr.info('', self.translate.instant('create-course.imgAlignmentDescription'), {
            positionClass: 'toast-top-center',
            timeOut: 5000,
          });
        });
        img.src = reader.result as string;
      };
      reader.readAsDataURL(file);
    } else {
      this.toastr.warning('', this.translate.instant('create-course.imgTooBig'), {
        positionClass: 'toast-top-center',
        timeOut: 5000,
      });
    }
    event.preventDefault();
  }

  createImgOverlay(): void {
    this.geoImageLayer = this.mapService.createGeoImageAndOverlay(
      this.map,
      this.overlayImgAsString,
      this.course.orienteeringMap.imageCenterX,
      this.course.orienteeringMap.imageCenterY,
      this.course.orienteeringMap.imageScaleX,
      this.course.orienteeringMap.imageScaleY,
      this.course.orienteeringMap.imageRotation
    );
    this.overlayImageIsActive = true;
  }

  overlayImgOnMap(): void {
    if (this.alignmentMapCoords.length === 2 && this.alignmentImgCoords.length === 2) {
      this.calcAlignment();

      this.createImgOverlay();

      this.overlayInProgress = false;
      document.getElementById('imgMap').classList.remove('imgAligningMap');
      document.getElementById('map').classList.remove('imgAligningMap');
      this.map.removeLayer(this.alignmentVectorLayer);

      this.vectorlayer.setVisible(true);
      this.vectorlayer2.setVisible(true);

      if (this.imgMap) {
        // Remove all Layers from imgMap, so they don't appear on Export
        const layerArray = this.imgMap.getLayers().getArray();
        let len = layerArray.length;
        while (len > 0) {
          const layer = layerArray[len - 1];
          this.imgMap.removeLayer(layer);
          len = layerArray.length;
        }
      }

      if (document.fullscreenElement !== null) document.exitFullscreen();

      if (this.zoomTemp !== undefined) this.map.getView().setZoom(this.zoomTemp);
    }
  }

  removeImageOverlay(): void {
    this.map.removeLayer(this.geoImageLayer);
    this.overlayImageIsActive = false;
    this.overlayImgAsString = null;
    this.course.orienteeringMap.imageCenterX = null;
    this.course.orienteeringMap.imageCenterY = null;
    this.course.orienteeringMap.imageScaleX = null;
    this.course.orienteeringMap.imageScaleY = null;
    this.course.orienteeringMap.imageRotation = null;

    /* this.center[0] = null;
    this.center[1] = null;
    this.scale[0] = null;
    this.scale[1] = null;
    this.rotation = null; */
  }

  resetAllVariables(): void {
    if (this.map !== undefined && this.geoImageLayer !== undefined) {
      this.map.removeLayer(this.geoImageLayer);
    }

    /* this.mapFinalBlob = undefined; */
    this.overlayImgAsString = undefined;
    this.course.orienteeringMap.imageCenterX = undefined;
    this.course.orienteeringMap.imageCenterY = undefined;
    this.course.orienteeringMap.imageScaleX = undefined;
    this.course.orienteeringMap.imageScaleY = undefined;
    this.course.orienteeringMap.imageRotation = undefined;
    /* this.center[0] = undefined;
    this.center[1] = undefined;
    this.scale[0] = undefined;
    this.scale[1] = undefined;
    this.rotation = undefined; */
    this.decliation = undefined;
    this.kmlString = undefined;
  }

  calcAlignment(): void {
    const xy = this.alignmentImgCoords;
    const XY = this.alignmentMapCoords;
    let i: number;
    const n = XY.length;
    let a = 1,
      b = 0,
      p = 0,
      q = 0;

    // Barycentre
    const mxy = { x: 0, y: 0 };
    const mXY = { x: 0, y: 0 };
    for (i = 0; i < n; i++) {
      mxy.x += xy[i][0];
      mxy.y += xy[i][1];
      mXY.x += XY[i][0];
      mXY.y += XY[i][1];
    }
    mxy.x /= n;
    mxy.y /= n;
    mXY.x /= n;
    mXY.y /= n;

    // Ecart au barycentre
    const xy0 = [],
      XY0 = [];
    for (i = 0; i < n; i++) {
      xy0.push({ x: xy[i][0] - mxy.x, y: xy[i][1] - mxy.y });
      XY0.push({ x: XY[i][0] - mXY.x, y: XY[i][1] - mXY.y });
    }

    // Resolution
    let SxX: number, SxY: number, SyY: number, SyX: number, Sx2: number, Sy2: number;
    SxX = SxY = SyY = SyX = Sx2 = Sy2 = 0;
    for (i = 0; i < n; i++) {
      SxX += xy0[i].x * XY0[i].x;
      SxY += xy0[i].x * XY0[i].y;
      SyY += xy0[i].y * XY0[i].y;
      SyX += xy0[i].y * XY0[i].x;
      Sx2 += xy0[i].x * xy0[i].x;
      Sy2 += xy0[i].y * xy0[i].y;
    }

    // Coefficients
    a = (SxX + SyY) / (Sx2 + Sy2);
    b = (SxY - SyX) / (Sx2 + Sy2);
    p = mXY.x - a * mxy.x + b * mxy.y;
    q = mXY.y - b * mxy.x - a * mxy.y;

    const sc = Math.sqrt(a * a + b * b);
    this.course.orienteeringMap.imageRotation = Math.acos(a / sc);
    if (b > 0) this.course.orienteeringMap.imageRotation *= -1;
    this.course.orienteeringMap.imageScaleX = sc;
    this.course.orienteeringMap.imageScaleY = sc;
    this.course.orienteeringMap.imageCenterX = p;
    this.course.orienteeringMap.imageCenterY = q;
    /* this.scale = [sc, sc];
    this.center = [p, q]; */
  }
}
