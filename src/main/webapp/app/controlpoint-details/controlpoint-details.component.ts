import { IQuestion } from './../shared/model/question.model';
import { ICourse } from './../shared/model/course.model';
import { MapServiceService } from './../map-service.service';
/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
/* eslint-disable no-console */
import { Component, OnInit, Input, ViewChild, EventEmitter, Output } from '@angular/core';
import { MatStepper } from '@angular/material/stepper';
import { CdkDragDrop, moveItemInArray, copyArrayItem } from '@angular/cdk/drag-drop';

// imports for Map
import Map from 'ol/Map';
import View from 'ol/View';
import { defaults as defaultInteractions } from 'ol/interaction';
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer';
import { Vector as VectorSource, XYZ } from 'ol/source';
import { Circle as CircleStyle, Stroke, Style, RegularShape } from 'ol/style';
import { fromLonLat } from 'ol/proj';
import { transform } from 'ol/proj';
import Point from 'ol/geom/Point';
import { defaults as defaultControls, ScaleLine } from 'ol/control';
import { Feature } from 'ol';
import LineString from 'ol/geom/LineString';
import { Question } from 'app/shared/model/question.model';
import { CategoryService } from 'app/entities/category/category.service';
import { HttpResponse } from '@angular/common/http';
import { ICategory, Category } from 'app/shared/model/category.model';
import { QuestionService } from 'app/entities/question/question.service';
import { Controlpoint } from 'app/shared/model/controlpoint.model';
import { TranslateService } from '@ngx-translate/core';
import { IControlpointInfo } from 'app/shared/model/controlpoint-info.model';
import { ToastrService } from 'ngx-toastr';

import { getPointResolution } from 'ol/proj.js';
import { Coordinate } from 'ol/coordinate';
import { Difficulty } from 'app/shared/model/enumerations/difficulty.model';
import { QuestionType } from 'app/shared/model/enumerations/question-type.model';

@Component({
  selector: 'jhi-controlpoint-details',
  templateUrl: './controlpoint-details.component.html',
  styleUrls: ['./controlpoint-details.component.scss'],
})
export class ControlpointDetailsComponent implements OnInit {
  @Input() expertMode: boolean;
  @Input() controlpoints: Controlpoint[];
  @Output() courseChange = new EventEmitter();
  @Input() globalStepper: MatStepper;
  @Input() allCPInfos: IControlpointInfo[];
  @Input() selectedCPInfos;
  @Input() course: ICourse;
  @ViewChild('controlpointStepper') controlpointStepper: MatStepper;

  /*   allQuestions!: Question[];
  filteredQuestions!: Question[];
  filteredAndSearchedQuestions!: Question[]; */
  questionsCreatedByMe!: Question[];
  myFilteredQuestions!: Question[];
  myFilteredAndSearchedQuestions!: Question[];
  difficultyFilter!: string;
  questionDifficulties = Difficulty;
  typeFilters = [];
  questionTypes = QuestionType;
  categories!: Category[];
  categoryFilter!: string;
  radiusCircle!: number;
  matTabSelectedIndizes = [];
  infoBorderColor = '#E95420';

  line: LineString;
  lat1: number;
  lat2: number;
  lon1: number;
  lon2: number;
  tempP1: Coordinate;
  tempP2: Coordinate;
  diffLon: number;
  diffLat: number;
  offsetLon: number;
  offsetLat: number;
  angleOfLine: number;
  dLat: number;
  dLon: number;

  stroke = new Stroke({ color: '#bf1377', width: 3 });

  constructor(
    protected categoryService: CategoryService,
    protected questionService: QuestionService,
    private toastr: ToastrService,
    private translate: TranslateService,
    private mapService: MapServiceService
  ) {}

  ngOnInit(): void {
    // this.source = new VectorSource();
    this.radiusCircle = 15;
    for (let index = 0; index < this.course.controlpoints?.length; index++) {
      this.matTabSelectedIndizes[index] = 0;
    }

    this.getCategories();
    this.typeFilters = this.getAllQuestionTypes();
    // this.getQuestionsFromServer();
    this.getPrivateQuestionsFromServer();
  }

  markSelectedControlpointInfos(): void {
    for (let i = 0; i < this.course.controlpoints.length; i++) {
      for (let j = 0; j < this.course.controlpoints[i].controlpointInfos?.length; j++) {
        document.getElementById(
          'cp' + i + '_info' + +this.course.controlpoints[i].controlpointInfos[j].id
        ).style.borderColor = this.infoBorderColor;
      }
    }
  }

  initializeDetailMaps(): void {
    const oldMaps = document.getElementsByName('detailMap');
    // remove old Maps

    oldMaps.forEach(function (oldMap: any): void {
      oldMap.innerHTML = '';
    });

    // initalize new maps
    let index = 0;
    let imgString = '';
    let kmlString = '';
    if (this.course.orienteeringMap.mapOverlayImage) {
      imgString = this.mapService.createDataURL(
        this.course.orienteeringMap.mapOverlayImageContentType,
        this.course.orienteeringMap.mapOverlayImage
      );
    }
    if (this.course.orienteeringMap.mapOverlayKml) {
      kmlString = this.mapService.createDataURL(
        this.course.orienteeringMap.mapOverlayKmlContentType,
        this.course.orienteeringMap.mapOverlayKml
      );
    }

    this.course.controlpoints.forEach(controlpoint => {
      const sourceLayer = new VectorSource();
      const targetID = 'map_cp' + index;
      // document.getElementById(target).innerHTML = '';
      const map = new Map({
        layers: [
          new TileLayer({
            source: new XYZ({
              url: 'https://{a-c}.tile.opentopomap.org/{z}/{x}/{y}.png',
              crossOrigin: 'Anonymous',
              attributions: this.translate.instant('mapAttribution'),
            }),
          }),
        ],
        controls: defaultControls({ zoom: false }).extend([
          new ScaleLine({
            units: 'metric',
            bar: true,
            steps: 4,
            text: false,
            minWidth: 100,
          }),
        ]),
        interactions: defaultInteractions({
          doubleClickZoom: false,
          mouseWheelZoom: false,
        }),
        target: targetID,
        view: new View({
          center: fromLonLat([controlpoint.longitude!, controlpoint.latitude!]),
          zoom: 17,
        }),
      });

      if (imgString) {
        this.mapService.createGeoImageAndOverlay(
          map,
          imgString,
          this.course.orienteeringMap.imageCenterX,
          this.course.orienteeringMap.imageCenterY,
          this.course.orienteeringMap.imageScaleX,
          this.course.orienteeringMap.imageScaleY,
          this.course.orienteeringMap.imageRotation
        );
      }
      if (kmlString) {
        this.mapService.addKMLtoMap(map, kmlString);
      }

      let resolution = map.getView().getResolution();
      const projection = map.getView().getProjection();
      const centerOfView = map.getView().getCenter();
      resolution = getPointResolution(projection.getCode(), resolution, centerOfView);
      const radiusCirc = controlpoint.radius! / resolution; /* / resolution */

      let layerStyle2 = undefined;

      // set Default Style depending
      let layerStyle = new Style({
        stroke: this.stroke,
        image: new CircleStyle({
          radius: radiusCirc,
          stroke: this.stroke,
        }),
      });

      // if first Controlpoint --> Triangle

      if (index === 0) {
        let rotationTriangle = 0;
        if (this.course.controlpoints.length > 1) {
          this.tempP1 = transform(
            [this.course.controlpoints[0].longitude, this.course.controlpoints[0].latitude],
            'EPSG:4326',
            'EPSG:3857'
          );
          this.tempP2 = transform(
            [this.course.controlpoints[1].longitude, this.course.controlpoints[1].latitude],
            'EPSG:4326',
            'EPSG:3857'
          );
          this.diffLon = this.tempP2[0] - this.tempP1[0];
          this.diffLat = this.tempP2[1] - this.tempP1[1];
          rotationTriangle = Math.atan2(this.diffLat, this.diffLon) - Math.PI / 2;
        }
        layerStyle = new Style({
          stroke: this.stroke,
          image: new RegularShape({
            stroke: this.stroke,
            points: 3,
            radius: radiusCirc,
            rotation: -rotationTriangle,
            angle: 0,
          }),
        });

        layerStyle2 = new Style({
          stroke: this.stroke,
          image: new CircleStyle({
            radius: radiusCirc,
            stroke: new Stroke({ color: '#555' }),
          }),
        });
      }

      // last Controlpoint --> paint two circles
      if (this.course.controlpoints.length > 1 && index === this.course.controlpoints.length - 1) {
        layerStyle = new Style({
          stroke: this.stroke,
          image: new CircleStyle({
            radius: radiusCirc,
            stroke: this.stroke,
          }),
        });

        layerStyle2 = new Style({
          stroke: this.stroke,
          image: new CircleStyle({
            radius: radiusCirc * 0.7,
            stroke: this.stroke,
          }),
        });
      }

      map.addLayer(
        new VectorLayer({
          source: sourceLayer,
          style: layerStyle,
          zIndex: 100,
        })
      );

      const point = new Point(
        transform([this.course.controlpoints[index].longitude!, this.course.controlpoints[index].latitude!], 'EPSG:4326', 'EPSG:3857')
      );
      const featurePoint = new Feature({
        name: 'Controlpoint ID ' + index,
        geometry: point,
      });

      sourceLayer.addFeature(featurePoint);

      if (layerStyle2 !== undefined) {
        const point2 = new Point(
          transform([this.course.controlpoints[index].longitude!, this.course.controlpoints[index].latitude!], 'EPSG:4326', 'EPSG:3857')
        );
        const featurePoint2 = new Feature({
          name: 'Controlpoint ID ' + index,
          geometry: point2,
        });
        featurePoint2.setStyle(layerStyle2);
        sourceLayer.addFeature(featurePoint2);
      }

      // paint line to previous
      if (index > 0) {
        this.lat1 = this.course.controlpoints[index - 1].latitude;
        this.lat2 = this.course.controlpoints[index].latitude;
        this.lon1 = this.course.controlpoints[index - 1].longitude;
        this.lon2 = this.course.controlpoints[index].longitude;
        this.tempP1 = transform([this.lon1, this.lat1], 'EPSG:4326', 'EPSG:3857');
        this.tempP2 = transform([this.lon2, this.lat2], 'EPSG:4326', 'EPSG:3857');
        this.diffLon = this.tempP2[0] - this.tempP1[0];
        this.diffLat = this.tempP2[1] - this.tempP1[1];
        this.angleOfLine = Math.atan2(this.diffLat, this.diffLon);
        this.dLon = Math.cos(this.angleOfLine) * controlpoint.radius;
        this.dLat = Math.sin(this.angleOfLine) * controlpoint.radius;
        this.offsetLon = this.dLon / (111111 * Math.cos((Math.PI * controlpoint.latitude) / 180));
        this.offsetLat = this.dLat / 111111;

        // Do not make this offset on the other side since the circle is not painted!
        /* this.lat1 = this.lat1 + this.offsetLat;
        this.lon1 = this.lon1 + this.offsetLon; */
        this.lat2 = this.lat2 - this.offsetLat;
        this.lon2 = this.lon2 - this.offsetLon;
        /* console.log('offset lon in meters: ' + this.dLon);
        console.log('offset lat in meters : ' + this.dLat);
        console.log('cos (alpha) = ' + Math.cos((Math.PI * controlpoint.latitude) / 180));
        console.log('divisor: ' + 111111 * Math.cos((Math.PI * controlpoint.latitude) / 180));
        console.log('offset lon: ' + this.offsetLon);
        console.log('offset lat: ' + this.offsetLat);
 */
        this.line = new LineString([
          transform([this.lon1, this.lat1], 'EPSG:4326', 'EPSG:3857'),
          transform([this.lon2, this.lat2], 'EPSG:4326', 'EPSG:3857'),
        ]);
        const featureLine = new Feature(this.line);
        sourceLayer.addFeature(featureLine);
      }

      // paint line to next
      if (index < this.course.controlpoints.length - 1) {
        this.lat1 = this.course.controlpoints[index].latitude;
        this.lat2 = this.course.controlpoints[index + 1].latitude;
        this.lon1 = this.course.controlpoints[index].longitude;
        this.lon2 = this.course.controlpoints[index + 1].longitude;
        this.tempP1 = transform([this.lon1, this.lat1], 'EPSG:4326', 'EPSG:3857');
        this.tempP2 = transform([this.lon2, this.lat2], 'EPSG:4326', 'EPSG:3857');
        this.diffLon = this.tempP2[0] - this.tempP1[0];
        this.diffLat = this.tempP2[1] - this.tempP1[1];
        this.angleOfLine = Math.atan2(this.diffLat, this.diffLon);
        this.dLon = Math.cos(this.angleOfLine) * controlpoint.radius;
        this.dLat = Math.sin(this.angleOfLine) * controlpoint.radius;
        this.offsetLon = this.dLon / (111111 * Math.cos((Math.PI * controlpoint.latitude) / 180));
        this.offsetLat = this.dLat / 111111;
        this.lat1 = this.lat1 + this.offsetLat;
        this.lon1 = this.lon1 + this.offsetLon;

        this.line = new LineString([
          transform([this.lon1, this.lat1], 'EPSG:4326', 'EPSG:3857'),
          transform([this.lon2, this.lat2], 'EPSG:4326', 'EPSG:3857'),
        ]);

        const featureLine = new Feature(this.line);
        sourceLayer.addFeature(featureLine);
      }

      (document.getElementById(targetID) as any).data = map;

      index++;
    });
  }

  toggleInfo(cpInfo: IControlpointInfo, cpIndex: number): void {
    let tooMuchInfo = false;
    if (
      this.course.controlpoints[cpIndex].controlpointInfos === undefined ||
      this.course.controlpoints[cpIndex].controlpointInfos === null
    ) {
      this.course.controlpoints[cpIndex].controlpointInfos = [];
    }
    const cpHasInfo = this.course.controlpoints[cpIndex].controlpointInfos.filter(info => info.id === cpInfo.id).length;

    if (cpHasInfo > 0) {
      // remove selected Info from Controlpoint
      this.course.controlpoints[cpIndex].controlpointInfos = this.course.controlpoints[cpIndex].controlpointInfos.filter(
        info => info.id !== cpInfo.id
      );
      document.getElementById('cp' + cpIndex + '_info' + cpInfo.id).style.borderColor = 'transparent';
    } else {
      // try to add Info to Controlpoint --> Check for Column
      switch (cpInfo.col) {
        case 'D': {
          const cpInfosInColEandD = this.course.controlpoints[cpIndex].controlpointInfos.filter(
            info => info.col === 'D' || info.col === 'E'
          ).length;
          if (cpInfosInColEandD < 2) {
            this.course.controlpoints[cpIndex].controlpointInfos.push(cpInfo);
            document.getElementById('cp' + cpIndex + '_info' + +cpInfo.id).style.borderColor = this.infoBorderColor;
          } else {
            tooMuchInfo = true;
          }
          break;
        }
        case 'E': {
          const cpInfosInColEandD = this.course.controlpoints[cpIndex].controlpointInfos.filter(
            info => info.col === 'D' || info.col === 'E'
          ).length;
          if (cpInfosInColEandD < 2) {
            const cpInfosInColE = this.course.controlpoints[cpIndex].controlpointInfos.filter(info => info.col === 'E').length;
            if (cpInfosInColE < 1) {
              this.course.controlpoints[cpIndex].controlpointInfos.push(cpInfo);
              document.getElementById('cp' + cpIndex + '_info' + +cpInfo.id).style.borderColor = this.infoBorderColor;
            } else {
              tooMuchInfo = true;
            }
          } else {
            tooMuchInfo = true;
          }
          break;
        }
        default: {
          const cpInfosInCol = this.course.controlpoints[cpIndex].controlpointInfos.filter(info => info.col === cpInfo.col);
          if (cpInfosInCol.length < 1) {
            this.course.controlpoints[cpIndex].controlpointInfos.push(cpInfo);
            document.getElementById('cp' + cpIndex + '_info' + +cpInfo.id).style.borderColor = this.infoBorderColor;
          } else {
            tooMuchInfo = true;
          }
          break;
        }
      }

      if (tooMuchInfo) {
        this.toastr.warning('', this.translate.instant('create-course.alreadyOneInfoForThisColumn'), {
          positionClass: 'toast-top-center',
          timeOut: 5000,
        });
      }
    }

    this.course.controlpoints[cpIndex].controlpointInfos.sort((a, b) => a.col.localeCompare(b.col));

    this.courseChange.emit(this.course);
  }

  skipValueChange($event: any, index: any): void {
    this.course.controlpoints[index].skippable = $event.checked;
    this.course.controlpoints[index].team = false;

    this.courseChange.emit(this.course);
  }

  radiusValueChange($event: any, index: any): void {
    this.course.controlpoints[index].radius = $event.value;
    this.radiusCircle = $event.value;

    this.courseChange.emit(this.course);

    this.initializeDetailMaps();
  }

  onSearchChange(): void {
    this.applySearchToFilteredQuestions();
  }

  dropQuestion(event: CdkDragDrop<string[]>, cpIndex: number): void {
    if (!(event.previousContainer.id === 'controlpointQuestionContainer' && event.container.id === 'allQuestionsContainer')) {
      if (event.previousContainer === event.container) {
        moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
      } else {
        // check if it already assigned to this controlpoint
        const currentQuestionID = (event.previousContainer.data[event.previousIndex] as IQuestion).id;
        let alreadyAssigned = false;
        this.course.controlpoints[cpIndex].questions.forEach(question => {
          if (question.id === currentQuestionID) alreadyAssigned = true;
        });
        if (!alreadyAssigned) {
          copyArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);

          this.checkQuestionsForAssignment();
        }
      }
      this.courseChange.emit(this.course);
    }
  }

  checkQuestionsForAssignment(): void {
    this.questionsCreatedByMe.forEach(questionCreatedByMe => {
      questionCreatedByMe.alreadyAssigned = false;
      this.course.controlpoints?.forEach(controlpoint => {
        controlpoint.questions?.forEach(question => {
          if (question.id === questionCreatedByMe.id) questionCreatedByMe.alreadyAssigned = true;
        });
      });
    });
    this.applyFiltersToAllQuestions();
    this.applySearchToFilteredQuestions();
  }

  removeQuestion(controlpointIndex: number, questionIndex: number): void {
    this.course.controlpoints[controlpointIndex].questions.splice(questionIndex, 1);

    this.checkQuestionsForAssignment();
    this.courseChange.emit(this.course);
  }

  getPrivateQuestionsFromServer(): void {
    this.questionService.getQuestionsCreatedByMe().subscribe((res: HttpResponse<ICategory[]>) => {
      this.questionsCreatedByMe = res.body || [];
      // this.checkQuestionsForAssignment();
      /* this.myFilteredQuestions = this.questionsCreatedByMe;
      this.myFilteredAndSearchedQuestions = this.questionsCreatedByMe; */
    });
  }

  getCategories(): void {
    this.categoryService.query().subscribe((res: HttpResponse<ICategory[]>) => (this.categories = res.body || []));
  }

  getAllQuestionDifficulties(): Array<string> {
    return Object.keys(this.questionDifficulties);
  }

  getAllQuestionTypes(): Array<string> {
    return Object.keys(this.questionTypes);
  }

  filterCategoryButtonClicked(i: number): void {
    if (this.categoryFilter === this.categories[i].text) {
      // same filter clicked --> disable filter
      this.categoryFilter = '';
    } else this.categoryFilter = this.categories[i].text;
    this.applyFiltersToAllQuestions();
    this.applySearchToFilteredQuestions();
  }

  filterDifficultyButtonClicked(selection: string): void {
    if (this.difficultyFilter === selection) {
      // same filter clicked --> disable filter
      this.difficultyFilter = '';
    } else this.difficultyFilter = selection;
    this.applyFiltersToAllQuestions();
    this.applySearchToFilteredQuestions();
  }

  filterQuestionTypeChanged(questionType: string): void {
    if (this.typeFilters.includes(questionType)) {
      this.typeFilters = this.typeFilters.filter(e => e !== questionType);
    } else {
      this.typeFilters.push(questionType);
    }
    this.applyFiltersToAllQuestions();
    this.applySearchToFilteredQuestions();
  }

  applyFiltersToAllQuestions(): void {
    this.myFilteredQuestions = this.questionsCreatedByMe;
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const self = this;
    if (this.categoryFilter) {
      this.myFilteredQuestions = this.myFilteredQuestions.filter(function (question): boolean {
        if (question.category.text === self.categoryFilter) return true;
        else return false;
      });
    }
    if (this.difficultyFilter) {
      this.myFilteredQuestions = this.myFilteredQuestions.filter(function (question): boolean {
        if (question.difficulty === self.difficultyFilter) return true;
        else return false;
      });
    }

    this.myFilteredQuestions = this.myFilteredQuestions.filter(function (question): boolean {
      if (self.typeFilters.includes(question.type)) return true;
      else return false;
    });
  }

  applySearchToFilteredQuestions(): void {
    const text = (document.getElementById('searchbox') as HTMLInputElement)?.value.toLowerCase();
    /* this.filteredAndSearchedQuestions = this.filteredQuestions.filter(function (o): boolean {
      return ['text', 'category'].some(function (k): boolean {
        if (k === 'category') return o[k].text.toString().toLowerCase().includes(text);
        else return o[k].toString().toLowerCase().indexOf(text) !== -1;
      });
    }); */
    this.myFilteredAndSearchedQuestions = this.myFilteredQuestions;
    if (text) {
      this.myFilteredAndSearchedQuestions = this.myFilteredAndSearchedQuestions.filter(function (o): boolean {
        return ['text', 'category'].some(function (k): boolean {
          if (k === 'category') return o[k].text.toString().toLowerCase().includes(text);
          else return o[k].toString().toLowerCase().indexOf(text) !== -1;
        });
      });
    }
  }

  successfullyCreatedQuestion(newQuestion: Question): void {
    if (!newQuestion.personal) {
      /* this.allQuestions.push(newQuestion); */
    }
    this.questionsCreatedByMe.push(newQuestion);
    this.categoryFilter = '';
    this.matTabSelectedIndizes[this.controlpointStepper.selectedIndex] = 0;
    this.course.controlpoints[this.controlpointStepper.selectedIndex].questions.push(newQuestion);

    this.checkQuestionsForAssignment();
    this.courseChange.emit(this.course);
    // const mattab = document.getElementById('questionstab_' + this.course.controlpointstepper.selectedIndex) as MatTabGroup;
  }

  backToDefineCourse(): void {
    this.globalStepper.previous();
  }

  continueToLastStep(): void {
    this.globalStepper.next();
  }
}
