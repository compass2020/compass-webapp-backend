import { ResultServiceService } from './../result-service.service';
import { GPXServiceService } from './../gpxservice.service';
import { MapServiceService } from './../map-service.service';
/* eslint-disable object-shorthand */
/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
/* eslint-disable @typescript-eslint/tslint/config */
/* eslint-disable @typescript-eslint/no-this-alias */
import { Component, OnInit, HostListener } from '@angular/core';
import { FeedbackService } from 'app/feedback.service';
import { ResultCourseService } from 'app/entities/result-course/result-course.service';
import { ResultCourse, IResultCourse } from 'app/shared/model/result-course.model';
import { HttpResponse } from '@angular/common/http';
import { Location } from '@angular/common';
import { fromLonLat } from 'ol/proj';
import { XYZ, Vector as VectorSource } from 'ol/source';
import { View, Feature } from 'ol';
import { defaults as defaultControls, FullScreen, ScaleLine } from 'ol/control';
import Map from 'ol/Map';
import { Tile as TileLayer, Vector as VectorLayer, VectorImage } from 'ol/layer';
import { Style, Fill, Stroke } from 'ol/style';
import Legend from 'ol-ext/control/Legend';
import Point from 'ol/geom/Point';
import CircleStyle from 'ol/style/Circle';
import { Course, ICourse } from 'app/shared/model/course.model';
import { CourseService } from 'app/entities/course/course.service';
import { Sort } from '@angular/material/sort';
import * as moment from 'moment';
import { JhiLanguageService } from 'ng-jhipster';
import { ResultAdditionalInfoService } from 'app/entities/result-additional-info/result-additional-info.service';
import { IResultAdditionalInfo } from 'app/shared/model/result-additional-info.model';
import { ToastrService } from 'ngx-toastr';

// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
import ApexCharts, { ApexOptions } from 'apexcharts';
import { TranslateService } from '@ngx-translate/core';
import { FeedbackRun } from 'app/feedback-run';
import { SpeedlineServiceService } from 'app/speedline-service.service';
import { ActivatedRoute } from '@angular/router';
import { SharedCourseService } from 'app/entities/shared-course/shared-course.service';
import { ISharedCourse } from 'app/shared/model/shared-course.model';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const gpxParser = require('fast-xml-parser');
const gpxParseOptions = {
  attributeNamePrefix: '',
  ignoreAttributes: false,
  parseAttributeValue: true,
};

@Component({
  selector: 'jhi-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.scss'],
})
export class FeedbackComponent implements OnInit {
  chartOptions!: ApexOptions;
  chart!: ApexCharts;
  feedbackRunsChartIndex!: number;
  expertMode = true;

  paramSharedCourseID;
  resultCourses: ResultCourse[];
  courses: Course[];
  source!: VectorSource;
  sourceLines!: VectorSource;
  gpxLayer!: VectorImage;
  gpxVectorSource!: VectorSource;
  gpxVectorLayer!: VectorLayer;
  map: Map;
  gpxCounter: number;
  colorCodes = [
    '#46f0f0',
    '#f032e6',
    '#bcf60c',
    '#4363d8',
    '#f58231',
    '#911eb4',
    '#e6194b',
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
    '#3cb44b',
    '#ffe119',
    '#ffffff',
    '#000000',
  ];
  hoverPoint: Feature;
  hoverPointLayer: VectorLayer;
  mapHeightOffsetDefault = 450;
  mapHeightOffset: number;
  resultCourseIDtoLayerIndex = [];
  gpxTrackToLayerIndex = [];
  minMax = [-1, -1];
  flowLineLegend!: Legend;

  initialResolution: number;

  styleHoverPoint = new Style({
    image: new CircleStyle({
      radius: this.mapService.symbolsFactor * 5.5,
      stroke: new Stroke({
        color: '#000',
        width: 3,
      }),
    }),
  });

  styleHoverPointInner = new Style({
    image: new CircleStyle({
      radius: this.mapService.symbolsFactor,
      fill: new Fill({ color: '#000' }),
    }),
  });

  flowLineCoordIndex: number;

  public feedbackRuns: FeedbackRun[];
  public maxSectorCount = 1;
  public minSectorCount = 1000;
  public maxCPsForceSkipped = 0;
  public maxQuestionCount = 0;
  public questionTexts = [];

  sortedRuns: FeedbackRun[];
  sortedRunsByTime: FeedbackRun[];

  constructor(
    public feedbackService: FeedbackService,
    private resultCourseService: ResultCourseService,
    private resultAdditionalInfoService: ResultAdditionalInfoService,
    private sharedCourseService: SharedCourseService,
    public jhiTranslateLanguage: JhiLanguageService,
    public translate: TranslateService,
    private courseService: CourseService,
    private route: ActivatedRoute,
    private location: Location,
    private mapService: MapServiceService,
    private gpxService: GPXServiceService,
    private toastr: ToastrService,
    private speedLineService: SpeedlineServiceService,
    public resultService: ResultServiceService
  ) {
    this.resultCourses = [];
    this.feedbackRuns = [];
    this.courses = [];
    this.gpxCounter = 0;
    this.sortedRuns = this.feedbackRuns.slice();
  }

  ngOnInit(): void {
    this.paramSharedCourseID = +this.route.snapshot.paramMap.get('sharedCourseID');
    if (this.paramSharedCourseID === null || this.paramSharedCourseID <= 0) {
      // no ID in URL --> check if variable is set, otherwise return back to results
      if (this.feedbackService.resultIDs.length === 0) {
        this.location.back();
      }
    }

    this.mapHeightOffset = this.mapHeightOffsetDefault;

    const self = this;
    this.chartOptions = {
      markers: {
        size: 0,
      },
      chart: {
        type: 'line',
        height: '100%',
        events: {
          mouseMove: function (event, chartContext, config) {
            if (self.hoverPoint) {
              if (self.feedbackRunsChartIndex !== undefined) {
                if (config.dataPointIndex !== -1) {
                  // Show point at coord
                  // console.log(config);
                  self.hoverPoint.setGeometry(
                    new Point(
                      fromLonLat([
                        self.feedbackRuns[self.feedbackRunsChartIndex].gpxJSON.gpx.trk.trkseg.trkpt[config.dataPointIndex].lon,
                        self.feedbackRuns[self.feedbackRunsChartIndex].gpxJSON.gpx.trk.trkseg.trkpt[config.dataPointIndex].lat,
                      ])
                    )
                  );
                  self.hoverPoint.setStyle([self.styleHoverPoint, self.styleHoverPointInner]);
                } else {
                  // hide point
                  self.hoverPoint.setStyle([]);
                }
              }
            } // The last parameter config contains additional information like `seriesIndex` and `dataPointIndex` for cartesian charts.
          },
        },
        toolbar: {
          tools: {
            zoom: true,
            zoomin: true,
            zoomout: false,
            pan: true,
          },
        },
        animations: {
          enabled: false,
        },
      },
      dataLabels: {
        enabled: false,
      },
      series: [],
      noData: {
        text: this.translate.instant('results.selectRun'),
      },
      stroke: {
        curve: 'smooth',
        width: 2,
      },
      xaxis: {
        type: 'datetime',
        labels: {
          format: 'HH:mm:ss',
        },
      },
      yaxis: [
        {
          title: {
            text: this.translate.instant('results.speed'),
          },
          decimalsInFloat: 2,
        },
        {
          opposite: true,
          title: {
            text: this.translate.instant('results.altitude'),
          },
          decimalsInFloat: 0,
        },
        {
          opposite: true,
          title: {
            text: this.translate.instant('results.heartRate'),
          },
          decimalsInFloat: 0,
        },
      ],
      tooltip: {
        x: {
          format: 'HH:mm:ss',
        },
        y: {
          formatter: function (value, series): string {
            switch (series.seriesIndex) {
              case 0:
                return Math.floor(value * 10) / 10 + ' km/h';
              case 1:
                return Math.floor(value) + ' m';
              default:
                return Math.floor(value) + '';
            }
          },
        },
      },
    };
  }

  ngAfterViewInit(): void {
    this.setupMap();

    if (this.paramSharedCourseID === null || this.paramSharedCourseID <= 0) {
      // fetch data from variable
      this.fetchAllResultCourses();
      this.fetchAllCourses();
    } else {
      // fetch data from URL
      this.sharedCourseService.find(this.paramSharedCourseID).subscribe(
        (res: HttpResponse<ISharedCourse>) => {
          if (res.body !== undefined) {
            const sharedCourse = res.body;
            this.courses.push(sharedCourse.course);
            this.mapService.addCourseToMap(sharedCourse.course, this.map, this.initialResolution, this.source, this.sourceLines);
            sharedCourse.resultCourses.forEach(resultCourse => {
              this.resultCourses.push(resultCourse);
              this.addToFeedbackTable(resultCourse);
            });
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

    this.chart = new ApexCharts(document.querySelector('#chart'), this.chartOptions);
    this.chart.render();
  }

  setupMap(): void {
    const self = this;

    this.source = new VectorSource();
    this.sourceLines = new VectorSource();
    this.gpxVectorSource = new VectorSource();

    this.map = new Map({
      layers: [
        new TileLayer({
          source: new XYZ({
            url: 'https://{a-c}.tile.opentopomap.org/{z}/{x}/{y}.png',
            maxZoom: 17,
            attributions: this.translate.instant('mapAttribution'),
          }),
          zIndex: 0,
          opacity: 0.6,
        }),
        new VectorLayer({
          source: this.source,
          zIndex: 2,
        }),
        new VectorLayer({
          source: this.sourceLines,
          zIndex: 3,
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
      target: 'feedbackmap',
      view: new View({
        center: [0, 0],
        zoom: 14,
      }),
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

    this.map.addControl(fullscreen);
    this.onResize();

    let currZoom = this.map.getView().getZoom();
    this.map.on('moveend', () => {
      const newZoom = self.map.getView().getZoom();
      if (currZoom !== newZoom) {
        currZoom = newZoom;
        self.sourceLines.clear();
        self.mapService.paintLines(self.courses[0].controlpoints, self.map, self.initialResolution, self.sourceLines);
      }
    });

    this.hoverPoint = new Feature(new Point([0, 0]));
    this.hoverPoint.setStyle([]);
    const hoverPointvectorSource = new VectorSource({});
    hoverPointvectorSource.addFeature(this.hoverPoint);
    this.hoverPointLayer = new VectorLayer({
      source: hoverPointvectorSource,
    });
    this.hoverPointLayer.setZIndex(1000);
    this.map.addLayer(this.hoverPointLayer);

    this.initialResolution = this.map.getView().getResolution();
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    if (this.map) {
      let temp = window.innerHeight - this.mapHeightOffset;
      if (temp < 500) temp = 500;
      (document.querySelector('#feedbackmap') as HTMLElement).style.height = temp + 'px';
      this.map.updateSize();
    }
  }

  fetchAllResultCourses(): void {
    this.feedbackService.resultIDs.forEach(resultID => {
      this.resultCourseService.find(resultID).subscribe((res: HttpResponse<IResultCourse>) => {
        if (res.body !== undefined) {
          this.resultCourses.push(res.body);
          this.addToFeedbackTable(res.body);
        }
      });
    });
  }

  fetchAllCourses(): void {
    this.source.clear();
    this.feedbackService.courseIDs.forEach(
      courseID => {
        this.courseService.find(courseID).subscribe((res: HttpResponse<ICourse>) => {
          if (res.body !== undefined) {
            this.courses.push(res.body);
            this.mapService.addCourseToMap(res.body, this.map, this.initialResolution, this.source, this.sourceLines);
          }
        });
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

  downloadGPX(run: FeedbackRun): void {
    this.gpxService.downloadGPX(run);
  }

  showDataInChart(resultCourseID) {
    if (resultCourseID !== -1) {
      this.expertMode = true;
      const heartRateArr = [];
      const altitudeArr = [];
      const speedArr = [];
      let maxXvalue = 0;

      for (let i = 0; i < this.feedbackRuns.length; i++) {
        if (this.feedbackRuns[i].id === resultCourseID) {
          if (!this.feedbackRuns[i].activeChart) {
            this.feedbackRunsChartIndex = i;
            let dateTime;
            // startTime = Date.parse(this.feedbackRuns[i].gpxJSON.gpx.trk.trkseg.trkpt[0].time); // change this to real starttime!
            if (this.feedbackRuns[i].hasGPX) {
              const startTimeGPX = Date.parse(this.feedbackRuns[i].gpxJSON.gpx.trk.trkseg.trkpt[0].time);
              maxXvalue =
                Date.parse(
                  this.feedbackRuns[i].gpxJSON.gpx.trk.trkseg.trkpt[this.feedbackRuns[i].gpxJSON.gpx.trk.trkseg.trkpt.length - 1].time
                ) - startTimeGPX;
              this.feedbackRuns[i].gpxJSON.gpx.trk.trkseg.trkpt.forEach(trkpt => {
                dateTime = Date.parse(trkpt.time);
                altitudeArr.push([dateTime - startTimeGPX, Math.round(trkpt.ele * 100) / 100]);
                speedArr.push([dateTime - startTimeGPX, Math.round(trkpt.speed * 3.6 * 100) / 100]);
              });
              /* hasGPX = true; */
            }
            if (this.feedbackRuns[i].hasHeartRate) {
              const startTimeHeartRate = Date.parse(this.feedbackRuns[i].heartRateJSON.data.heartrate[0].time);
              maxXvalue =
                Date.parse(
                  this.feedbackRuns[i].heartRateJSON.data.heartrate[this.feedbackRuns[i].heartRateJSON.data.heartrate.length - 1].time
                ) - startTimeHeartRate;
              this.feedbackRuns[i].heartRateJSON.data.heartrate.forEach(heartRate => {
                dateTime = Date.parse(heartRate.time);
                heartRateArr.push([dateTime - startTimeHeartRate, Math.round(heartRate.value)]);
              });
              /* hasHeartRate = true; */
            }
            this.feedbackRuns[i].isActive = true;
            this.feedbackRuns[i].activeChart = true;
          } else {
            this.chart.updateSeries([]);

            for (let j = 0; j < this.feedbackRuns.length; j++) {
              this.feedbackRuns[j].activeChart = false;
            }
            for (let j = 0; j < this.sortedRuns.length; j++) {
              this.sortedRuns[j].activeChart = false;
            }
            return;
          }
        } else {
          this.feedbackRuns[i].activeChart = false;
        }
      }
      for (let i = 0; i < this.sortedRuns.length; i++) {
        this.sortedRuns[i].activeChart = false;
        if (this.sortedRuns[i].id === resultCourseID) {
          this.sortedRuns[i].isActive = true;
          this.sortedRuns[i].activeChart = true;
        }
      }

      const seriesArr = [];
      this.chartOptions.xaxis.min = 0;
      this.chartOptions.xaxis.max = maxXvalue;
      this.chartOptions.yaxis[0].show = false;
      this.chartOptions.yaxis[1].show = false;
      this.chartOptions.yaxis[2].show = false;
      if (this.feedbackRuns[this.feedbackRunsChartIndex].hasGPX) {
        this.chartOptions.yaxis[0].show = true;
        this.chartOptions.yaxis[1].show = true;

        // smoothen arrays
        seriesArr.push({ name: this.translate.instant('results.speed'), type: 'line', data: this.gpxService.movingAverage(speedArr) });
        seriesArr.push({
          name: this.translate.instant('results.altitude'),
          type: 'line',
          data: this.gpxService.movingAverage(altitudeArr),
        });
      } else {
        seriesArr.push({ name: this.translate.instant('results.speed'), type: 'line', data: [] });
        seriesArr.push({ name: this.translate.instant('results.altitude'), type: 'line', data: [] });
      }
      if (this.feedbackRuns[this.feedbackRunsChartIndex].hasHeartRate) {
        this.chartOptions.yaxis[2].show = true;
        seriesArr.push({
          name: this.translate.instant('results.heartRate'),
          type: 'line',
          data: this.gpxService.movingAverage(heartRateArr),
        });
      }

      this.chart.updateOptions(this.chartOptions);
      this.chart.updateSeries(seriesArr);
    } else {
      this.chart.updateSeries([]);

      for (let j = 0; j < this.feedbackRuns.length; j++) {
        this.feedbackRuns[j].activeChart = false;
      }
      for (let j = 0; j < this.sortedRuns.length; j++) {
        this.sortedRuns[j].activeChart = false;
      }
    }
  }

  movingAverage(inputArr): any {
    let meanX = 0;
    let meanY = 0;
    const moveMean = [];
    for (let i = 2; i < inputArr.length - 2; i++) {
      meanX = (inputArr[i][0] + inputArr[i - 1][0] + inputArr[i + 1][0] + inputArr[i - 2][0] + inputArr[i + 2][0]) / 5.0;
      meanY = (inputArr[i][1] + inputArr[i - 1][1] + inputArr[i + 1][1] + inputArr[i - 2][1] + inputArr[i + 2][1]) / 5.0;
      moveMean.push([meanX, meanY]);
    }
    return moveMean;
  }

  activateFlowLine(resultCourseID) {
    if (resultCourseID !== -1) {
      if (this.gpxLayer !== undefined) this.gpxLayer.getSource().clear();
      this.map.removeControl(this.flowLineLegend);

      const layerIndex = this.resultCourseIDtoLayerIndex.indexOf(resultCourseID);

      if (layerIndex !== -1) {
        (this.map.getLayers().getArray()[layerIndex] as VectorLayer).setVisible(true);
        for (let i = 0; i < this.feedbackRuns.length; i++) {
          if (this.feedbackRuns[i].id === resultCourseID) {
            if (!this.feedbackRuns[i].activeSpeedLine) {
              this.flowLineLegend = this.speedLineService.createFlowLine(this.feedbackRuns[i].gpxJSON, this.gpxVectorSource, this.map);
              this.feedbackRuns[i].isActive = true;
              this.feedbackRuns[i].activeSpeedLine = true;
            } else {
              if (this.gpxVectorSource !== undefined) this.gpxVectorSource.clear();
              this.map.removeControl(this.flowLineLegend);
              for (let j = 0; j < this.feedbackRuns.length; j++) {
                this.feedbackRuns[j].activeSpeedLine = false;
              }
              for (let j = 0; j < this.sortedRuns.length; j++) {
                this.sortedRuns[j].activeSpeedLine = false;
              }
              return;
            }
          }
          this.feedbackRuns[i].activeSpeedLine = false;
        }
        for (let i = 0; i < this.sortedRuns.length; i++) {
          this.sortedRuns[i].activeSpeedLine = false;
          if (this.sortedRuns[i].id === resultCourseID) {
            this.sortedRuns[i].isActive = true;
            this.sortedRuns[i].activeSpeedLine = true;
          }
        }
      }
    } else {
      if (this.gpxVectorSource !== undefined) this.gpxVectorSource.clear();
      this.map.removeControl(this.flowLineLegend);
      for (let i = 0; i < this.feedbackRuns.length; i++) {
        this.feedbackRuns[i].activeSpeedLine = false;
      }
      for (let i = 0; i < this.sortedRuns.length; i++) {
        this.sortedRuns[i].activeSpeedLine = false;
      }
    }
  }

  toggleView(event, resultCourseID): void {
    for (let i = 0; i < this.feedbackRuns.length; i++) {
      if (this.feedbackRuns[i].id === resultCourseID) {
        // search for the result in feedback table
        if (this.feedbackRuns[i].fetchedGPX) {
          // already fetched
          const layerIndex = this.resultCourseIDtoLayerIndex.indexOf(resultCourseID);
          if (layerIndex !== -1) {
            // if result has valid GPX it layerIndex should not be -1
            this.map.getLayers().getArray()[layerIndex].setVisible(event.checked);
          }

          // no matter is GPX is valid or not --> set isActive
          this.feedbackRuns[i].isActive = event.checked;
          for (let j = 0; j < this.sortedRuns.length; j++) {
            if (this.sortedRuns[j].id === resultCourseID) {
              this.sortedRuns[j].isActive = event.checked;
            }
          }

          break;
        } else {
          // fetch now
          // fetch gpx from database and show on map
          this.fetchAdditionalInfoFromDatabase(resultCourseID);
        }
      }
    }
  }

  showChartIfCurrentlyNoData(resultCourseID: number): void {
    let atLeastOneIsInChart = false;
    for (let i = 0; i < this.feedbackRuns.length; i++) {
      if (this.feedbackRuns[i].activeChart) {
        atLeastOneIsInChart = true;
        break;
      }
    }
    if (!atLeastOneIsInChart) this.showDataInChart(resultCourseID);
  }

  fetchAdditionalInfoFromDatabase(resultCourseID): void {
    // fetch gpx from database and show on map
    this.resultAdditionalInfoService.findByResultCourseID(resultCourseID).subscribe((res: HttpResponse<IResultAdditionalInfo>) => {
      if (res.body !== undefined) {
        // this.resultCourses.push(res.body);
        let gpxObj, tempArr, heartRateObj;
        let gpxAvailable = true;
        let heartRateAvailable = true;
        try {
          if (res.body.gpxTrack !== null) {
            const gpxBuffer = new Buffer(res.body.gpxTrack, 'base64');
            const gpxString = gpxBuffer.toString();

            gpxObj = gpxParser.parse(gpxString, gpxParseOptions);

            const tempValue = gpxObj?.gpx?.trk?.trkseg?.trkpt?.length;
            if (tempValue === undefined) gpxAvailable = false;
            else {
              this.gpxService.addLayerFromGPXFile(this.map, res.body.gpxTrack, this.colorCodes[this.gpxCounter % 22]);

              this.resultCourseIDtoLayerIndex[this.map.getLayers().getLength() - 1] = resultCourseID;
              this.gpxTrackToLayerIndex[this.map.getLayers().getLength() - 1] = res.body.gpxTrack;
              tempArr = this.gpxService.calcDataFromGPX(gpxObj);
            }
          } else gpxAvailable = false;
        } catch {
          gpxAvailable = false;
        }
        try {
          if (res.body.heartRate !== null) {
            const heartRateBuffer = new Buffer(res.body.heartRate, 'base64');
            const heartRateString = heartRateBuffer.toString();
            heartRateObj = gpxParser.parse(heartRateString, gpxParseOptions);

            const tempValue = heartRateObj?.data?.heartrate?.length;
            if (tempValue === undefined) heartRateAvailable = false;
          } else heartRateAvailable = false;
        } catch {
          heartRateAvailable = false;
        }
        for (let i = 0; i < this.feedbackRuns.length; i++) {
          if (this.feedbackRuns[i].id === resultCourseID) {
            this.feedbackRuns[i].base64GPX = res.body.gpxTrack;
            this.feedbackRuns[i].base64HeartRate = res.body.heartRate;
            this.feedbackRuns[i].fetchedGPX = true;
            this.feedbackRuns[i].isActive = true;
            this.feedbackRuns[i].colorIndex = this.gpxCounter;
            this.feedbackRuns[i].gpxJSON = gpxObj;
            this.feedbackRuns[i].heartRateJSON = heartRateObj;
            this.feedbackRuns[i].hasGPX = gpxAvailable;
            this.feedbackRuns[i].hasHeartRate = heartRateAvailable;
            if (gpxAvailable) {
              if (tempArr !== []) {
                this.feedbackRuns[i].avgSpeed = tempArr[0];
                this.feedbackRuns[i].altUp = tempArr[1];
                this.feedbackRuns[i].altDown = tempArr[2];
                this.feedbackRuns[i].distance = tempArr[3];
              }
            }
          }
        }
        for (let i = 0; i < this.sortedRuns.length; i++) {
          if (this.sortedRuns[i].id === resultCourseID) {
            this.sortedRuns[i].base64GPX = res.body.gpxTrack;
            this.sortedRuns[i].base64HeartRate = res.body.heartRate;
            this.sortedRuns[i].fetchedGPX = true;
            this.sortedRuns[i].isActive = true;
            this.sortedRuns[i].colorIndex = this.gpxCounter;
            this.sortedRuns[i].gpxJSON = gpxObj;
            this.sortedRuns[i].heartRateJSON = heartRateObj;
            this.sortedRuns[i].hasGPX = gpxAvailable;
            this.sortedRuns[i].hasHeartRate = heartRateAvailable;

            if (gpxAvailable) {
              if (tempArr !== []) {
                this.sortedRuns[i].avgSpeed = tempArr[0];
                this.sortedRuns[i].altUp = tempArr[1];
                this.sortedRuns[i].altDown = tempArr[2];
                this.sortedRuns[i].distance = tempArr[3];
              }
            }
          }
        }
        this.gpxCounter++;

        this.showChartIfCurrentlyNoData(resultCourseID);
      }
    });
  }

  sortData(sort: Sort) {
    this.sortedRuns = this.resultService.sortData(sort, this.feedbackRuns);
  }

  addToFeedbackTable(resultCourse: IResultCourse): void {
    resultCourse.resultControlpoints.sort((a, b) => (a.sequence > b.sequence ? 1 : -1));

    const sectorTimeArr = [];
    const sectorWasSkipped = [];
    const lastSectorWasSkipped = [];
    const controlPointWasForceSkipped = [];
    let forceSkippedTooltip = '';
    let questionCount = 0;
    let nrOfQuestions = 0;
    let correctAnswers = 0;
    const answerArr = [];
    for (let i = 0; i < resultCourse.resultControlpoints.length; i++) {
      if (i < resultCourse.resultControlpoints.length - 1) {
        const finishMoment = moment(resultCourse.resultControlpoints[i + 1].timeReached);
        const startMoment = moment(resultCourse.resultControlpoints[i].timeReached);

        const difference = finishMoment.diff(startMoment);

        if (difference !== 0) sectorWasSkipped.push(false);
        else sectorWasSkipped.push(true);
        sectorTimeArr.push(difference);
      }

      controlPointWasForceSkipped.push(resultCourse.resultControlpoints[i].forceSkipped);
      if (resultCourse.resultControlpoints[i].forceSkipped) {
        if (i === 0) forceSkippedTooltip = forceSkippedTooltip + this.translate.instant('create-course.start') + '  ';
        else if (i === resultCourse.resultControlpoints.length - 1)
          forceSkippedTooltip = forceSkippedTooltip + this.translate.instant('create-course.finish');
        else forceSkippedTooltip = forceSkippedTooltip + '#' + i + '  ';
      }

      questionCount += resultCourse.resultControlpoints[i].resultQuestions.length;

      for (let j = 0; j < resultCourse.resultControlpoints[i].resultQuestions.length; j++) {
        answerArr.push(resultCourse.resultControlpoints[i].resultQuestions[j].answeredCorrectly);
        if (answerArr[answerArr.length - 1] !== null) {
          nrOfQuestions++;
          if (answerArr[answerArr.length - 1]) correctAnswers++;
        }
      }
    }

    if (this.maxQuestionCount < questionCount) {
      this.maxQuestionCount = questionCount;
      this.questionTexts = [];
      for (let i = 0; i < resultCourse.resultControlpoints.length; i++) {
        for (let j = 0; j < resultCourse.resultControlpoints[i].resultQuestions.length; j++) {
          this.questionTexts.push(resultCourse.resultControlpoints[i].resultQuestions[j].text);
        }
      }
    }
    lastSectorWasSkipped.push(false);
    for (let i = 0; i < sectorWasSkipped.length - 1; i++) {
      lastSectorWasSkipped.push(sectorWasSkipped[i]);
    }

    if (sectorTimeArr.length > this.maxSectorCount) this.maxSectorCount = sectorTimeArr.length;
    if (sectorTimeArr.length - sectorWasSkipped.filter(Boolean).length < this.minSectorCount)
      this.minSectorCount = sectorTimeArr.length - sectorWasSkipped.filter(Boolean).length;

    this.feedbackRuns.push({
      isActive: false,
      fetchedGPX: false,
      activeChart: false,
      activeSpeedLine: false,
      gpxJSON: undefined,
      heartRateJSON: undefined,
      colorIndex: -1,
      id: resultCourse.id,
      name: resultCourse.nickName,
      startTime: resultCourse.timeStampStarted,
      totalTime: resultCourse.totalDurationInMillis,
      sectorTimes: sectorTimeArr,
      sectorWasSkipped: sectorWasSkipped,
      lastSectorWasSkipped: lastSectorWasSkipped,
      showPositionCounter: resultCourse.showPositionCounter,
      switchAppCounter: resultCourse.switchAppCounter,
      distance: undefined,
      avgSpeed: undefined,
      altUp: undefined,
      altDown: undefined,
      answers: answerArr,
      nrOfQuestions: nrOfQuestions,
      correctAnswers: correctAnswers,
      hasGPX: false,
      hasHeartRate: false,
      base64GPX: undefined,
      base64HeartRate: undefined,
      controlPointWasForceSkipped: controlPointWasForceSkipped,
      nrOfForceSkips: controlPointWasForceSkipped.filter(Boolean).length,
      forceSkippedTooltip: forceSkippedTooltip,
      nrOfBorgSkipped: sectorWasSkipped.filter(Boolean).length,
    });

    if (this.maxCPsForceSkipped < controlPointWasForceSkipped.filter(Boolean).length)
      this.maxCPsForceSkipped = controlPointWasForceSkipped.filter(Boolean).length;

    this.sortedRuns = this.feedbackRuns.slice();
    this.sortedRuns.sort((a, b) => (a.totalTime > b.totalTime ? 1 : -1));

    this.sortedRunsByTime = this.sortedRuns;
  }
}
