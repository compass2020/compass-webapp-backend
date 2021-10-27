import { ICourse } from 'app/shared/model/course.model';
import { DistanceServiceService } from './distance-service.service';
import ImageLayer from 'ol/layer/Image';
import GeoImage from 'ol-ext/source/GeoImage';
/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
import { Vector as VectorSource } from 'ol/source';
import VectorLayer from 'ol/layer/Vector';
import { Controlpoint } from 'app/shared/model/controlpoint.model';
import Map from 'ol/Map';
import { Injectable } from '@angular/core';
import { Circle as CircleStyle, Stroke, Style, RegularShape, Fill, Text as OLText } from 'ol/style';
import Feature from 'ol/Feature';
import { transform } from 'ol/proj';
import LineString from 'ol/geom/LineString';
import Point from 'ol/geom/Point';
import { Collection } from 'ol';
import KML from 'ol/format/KML';
import { buffer, createEmpty, extend } from 'ol/extent';

@Injectable({
  providedIn: 'root',
})
export class MapServiceService {
  offsetValueVariable = 180; // 110 for vienna   // 180 - 200 for equator // 30 for 80° N
  offsetValue = 0;
  symbolsFactor = 3;
  startRotation = 0;
  textOffset = 20;
  textSize = 24;

  lat1;
  lat2;
  lon1;
  lon2;
  tempP1;
  tempP2;
  diffLat;
  diffLon;
  offsetLon;
  offsetLat;
  angleOfLine;
  dLat;
  dLon;
  line;

  colorTeam = '#333333';
  colorSkip = '#bf1377';
  colorDefault = '#bf1377';
  colorFinish = '#bf1377';
  // #A626FF --> CMYK from IOF to RGB
  // #ae4490 --> ColorMeter from IOF PDF
  // #fb33fb --> https://oomap.co.uk/global/
  // #bf1377 --> ColorMeter from map we received via skype

  stroke!: Stroke;
  strokeSkip!: Stroke;
  styleTeam!: Style;
  styleSkip!: Style;
  styleStart!: Style;
  styleDefault!: Style;
  styleFinishSmall!: Style;
  styleFinishBig!: Style;
  styleText!: OLText;

  constructor(private distanceService: DistanceServiceService) {
    this.setupStyles();
  }

  setupStyles(): void {
    this.stroke = new Stroke({ color: this.colorDefault, width: 1 * this.symbolsFactor });
    this.strokeSkip = new Stroke({ color: this.colorSkip, width: 1 * this.symbolsFactor, lineDash: [10, 5] });

    this.styleTeam = new Style({
      image: new CircleStyle({
        radius: 7,
        stroke: new Stroke({
          color: this.colorTeam,
          width: 3,
        }),
      }),
    });

    this.styleSkip = new Style({
      stroke: this.strokeSkip,
    });

    this.styleStart = new Style({
      image: new RegularShape({
        stroke: this.stroke,
        points: 3,
        radius: this.symbolsFactor * ((6 * 2) / Math.sqrt(3)),
        rotation: this.startRotation,
        angle: 0,
      }),
    });

    this.styleDefault = new Style({
      image: new CircleStyle({
        radius: this.symbolsFactor * 5.5,
        stroke: this.stroke,
      }),
      text: new OLText({
        font: this.textSize + 'px Calibri,sans-serif',
        fill: new Fill({ color: '#bf1377' }),
        stroke: new Stroke({ color: '#bf1377', width: 2 }),
        text: '',
        offsetX: this.textOffset,
        offsetY: this.textOffset * -1,
      }),
      stroke: this.stroke,
    });

    this.styleFinishSmall = new Style({
      image: new CircleStyle({
        radius: this.symbolsFactor * 4,
        stroke: this.stroke,
      }),
    });

    this.styleFinishBig = new Style({
      image: new CircleStyle({
        radius: this.symbolsFactor * 6,
        stroke: this.stroke,
      }),
    });
  }

  paintControlPoints(controlpoints: Controlpoint[], source: VectorSource): Collection<Feature> {
    const featureCollection = new Collection<Feature>();
    for (let i = 0; i < controlpoints?.length; i++) {
      const point = new Point(transform([controlpoints[i].longitude!, controlpoints[i].latitude!], 'EPSG:4326', 'EPSG:3857'));
      const featurePoint = new Feature({
        name: 'Controlpoint ID ' + i,
        geometry: point,
      });
      featurePoint.setId(i);
      /* featurePoint.getGeometry().on('change', () => {
        modifiedFeature = featurePoint;
      });
 */
      const styleWithText = this.styleDefault.clone();
      styleWithText.getText().setText(i + '');
      featurePoint.setStyle(styleWithText);

      if (controlpoints.length > 1 && i === controlpoints.length - 1) {
        featurePoint.setStyle(this.styleFinishSmall);

        // addSecondCircleForFinish
        const outerpoint = new Point(transform([controlpoints[i].longitude!, controlpoints[i].latitude!], 'EPSG:4326', 'EPSG:3857'));
        const featureOuterPoint = new Feature({
          name: 'Controlpoint ID ' + i,
          geometry: outerpoint,
        });

        featureOuterPoint.setStyle(this.styleFinishBig);
        source.addFeature(featureOuterPoint);
      }

      if (i === 0) {
        if (controlpoints.length > 1) {
          this.tempP1 = transform([controlpoints[0].longitude, controlpoints[0].latitude], 'EPSG:4326', 'EPSG:3857');
          this.tempP2 = transform([controlpoints[1].longitude, controlpoints[1].latitude], 'EPSG:4326', 'EPSG:3857');
          this.diffLon = this.tempP2[0] - this.tempP1[0];
          this.diffLat = this.tempP2[1] - this.tempP1[1];
          this.styleStart.getImage().setRotation((Math.atan2(this.diffLat, this.diffLon) - Math.PI / 2) * -1);
        }
        featurePoint.setStyle(this.styleStart);
      }

      source.addFeature(featurePoint);
      featureCollection.push(featurePoint);
    }
    return featureCollection;
  }

  paintLines(controlpoints: Controlpoint[], map: Map, initialResolution: number, source: VectorSource): number {
    // return length between all coordinates
    let courseLength = 0;

    const currResolution = map.getView().getResolution();
    const factorResolution = currResolution / initialResolution;
    for (let i = 0; i < controlpoints?.length; i++) {
      if (i > 0) {
        this.lat1 = controlpoints[i - 1].latitude;
        this.lat2 = controlpoints[i].latitude;
        this.lon1 = controlpoints[i - 1].longitude;
        this.lon2 = controlpoints[i].longitude;
        this.tempP1 = transform([this.lon1, this.lat1], 'EPSG:4326', 'EPSG:3857');
        this.tempP2 = transform([this.lon2, this.lat2], 'EPSG:4326', 'EPSG:3857');
        this.diffLon = this.tempP2[0] - this.tempP1[0];
        this.diffLat = this.tempP2[1] - this.tempP1[1];
        this.angleOfLine = Math.atan2(this.diffLat, this.diffLon);
        this.offsetValue = this.offsetValueVariable * Math.cos((Math.PI * controlpoints[i].latitude) / 180);
        this.dLon = Math.cos(this.angleOfLine) * (this.offsetValue * factorResolution);
        this.dLat = Math.sin(this.angleOfLine) * (this.offsetValue * factorResolution);
        this.offsetLon = this.dLon / (111111 * Math.cos((Math.PI * controlpoints[i].latitude) / 180));
        this.offsetLat = this.dLat / 111111;

        this.lat1 = this.lat1 + this.offsetLat;
        this.lon1 = this.lon1 + this.offsetLon;
        this.lat2 = this.lat2 - this.offsetLat;
        this.lon2 = this.lon2 - this.offsetLon;

        this.line = new LineString([
          transform([this.lon1, this.lat1], 'EPSG:4326', 'EPSG:3857'),
          transform([this.lon2, this.lat2], 'EPSG:4326', 'EPSG:3857'),
        ]);

        const featureLine = new Feature(this.line);
        featureLine.setStyle(this.styleDefault);
        courseLength +=
          this.distanceService.getDistanceFromLatLonInKm(
            controlpoints[i - 1].latitude,
            controlpoints[i - 1].longitude,
            controlpoints[i].latitude,
            controlpoints[i].longitude
          ) * 1000;
        source.addFeature(featureLine);
      }

      if (i > 2 && controlpoints[i - 1].skippable) {
        this.lat1 = controlpoints[i - 2].latitude;
        this.lat2 = controlpoints[i].latitude;
        this.lon1 = controlpoints[i - 2].longitude;
        this.lon2 = controlpoints[i].longitude;
        this.tempP1 = transform([this.lon1, this.lat1], 'EPSG:4326', 'EPSG:3857');
        this.tempP2 = transform([this.lon2, this.lat2], 'EPSG:4326', 'EPSG:3857');
        this.diffLon = this.tempP2[0] - this.tempP1[0];
        this.diffLat = this.tempP2[1] - this.tempP1[1];
        this.angleOfLine = Math.atan2(this.diffLat, this.diffLon);
        this.dLon = Math.cos(this.angleOfLine) * (this.offsetValue * factorResolution);
        this.dLat = Math.sin(this.angleOfLine) * (this.offsetValue * factorResolution);
        this.offsetLon = this.dLon / (111111 * Math.cos((Math.PI * controlpoints[i].latitude) / 180));
        this.offsetLat = this.dLat / 111111;

        this.lat1 = this.lat1 + this.offsetLat;
        this.lon1 = this.lon1 + this.offsetLon;
        this.lat2 = this.lat2 - this.offsetLat;
        this.lon2 = this.lon2 - this.offsetLon;

        this.line = new LineString([
          transform([this.lon1, this.lat1], 'EPSG:4326', 'EPSG:3857'),
          transform([this.lon2, this.lat2], 'EPSG:4326', 'EPSG:3857'),
        ]);

        const featureSkipLine = new Feature(this.line);
        this.styleSkip.getStroke().setLineDash([10, 7]);
        featureSkipLine.setStyle(this.styleSkip);
        source.addFeature(featureSkipLine);
      }
    }
    return courseLength;
  }

  addKMLtoMap(map: Map, kmlString: string): VectorLayer {
    const kmlLayer = new VectorLayer({
      source: new VectorSource({
        url: kmlString,
        format: new KML(),
      }),
    });

    map.addLayer(kmlLayer);
    return kmlLayer;
  }

  createGeoImageAndOverlay(
    map: Map,
    imgString: string,
    centerX: number,
    centerY: number,
    scaleX: number,
    scaleY: number,
    rotation: number
  ): ImageLayer {
    const geoImage = new GeoImage({
      url: imgString,
      imageCenter: [centerX, centerY],
      imageScale: [scaleX, scaleY],
      imageRotate: rotation,
    });

    const geoImageLayer = new ImageLayer({
      opacity: 1,
      source: geoImage,
    });

    geoImageLayer.setZIndex(1);
    map.addLayer(geoImageLayer);
    return geoImageLayer;
  }

  createDataURL(contentType: string, data: string): string {
    return 'data:' + contentType + ';base64,' + data;
  }

  fitMapToSource(map: Map, source: VectorSource): void {
    let extent = createEmpty();
    source.getFeatures().forEach(function (feature): void {
      // add extent of every feature to the extent
      extent = extend(extent, feature.getGeometry().getExtent());
    });
    const width = extent[2] - extent[0];
    const height = extent[3] - extent[1];
    const max = Math.max(width, height);

    extent = buffer(extent, max * 0.15); // add 15% to extent

    map.getView().fit(extent);
  }

  addCourseToMap(course: ICourse, map: Map, initialResolution: number, source: VectorSource, sourceLines: VectorSource): void {
    course.controlpoints.sort((a, b) => (a.sequence > b.sequence ? 1 : -1));

    this.paintControlPoints(course.controlpoints, source);
    this.fitMapToSource(map, source);
    this.paintLines(course.controlpoints, map, initialResolution, sourceLines);
    if (course.orienteeringMap.mapOverlayImage !== null) {
      const imageString = this.createDataURL(course.orienteeringMap.mapOverlayImageContentType, course.orienteeringMap.mapOverlayImage);
      this.createGeoImageAndOverlay(
        map,
        imageString,
        course.orienteeringMap.imageCenterX,
        course.orienteeringMap.imageCenterY,
        course.orienteeringMap.imageScaleX,
        course.orienteeringMap.imageScaleY,
        course.orienteeringMap.imageRotation
      );
    }
    if (course.orienteeringMap.mapOverlayKml !== null) {
      const kmlString = this.createDataURL(course.orienteeringMap.mapOverlayKmlContentType, course.orienteeringMap.mapOverlayKml);
      this.addKMLtoMap(map, kmlString);
    }
  }
}
