import { DistanceServiceService } from './distance-service.service';
import { Injectable } from '@angular/core';
import { Vector as VectorSource } from 'ol/source';
import VectorLayer from 'ol/layer/Vector';
import Map from 'ol/Map';
import { Fill, Stroke, Style } from 'ol/style';
import CircleStyle from 'ol/style/Circle';
import GPX from 'ol/format/GPX';
import { FeedbackRun } from './feedback-run';

@Injectable({
  providedIn: 'root',
})
export class GPXServiceService {
  constructor(private distanceService: DistanceServiceService) {}

  calcDataFromGPX(gpxObj: any): number[] {
    const arr = [];
    let up = 0;
    let down = 0;
    let distance = 0;
    if (gpxObj.gpx.trk.trkseg !== '') {
      let lastEle = 0;
      for (let i = 0; i < gpxObj.gpx.trk.trkseg.trkpt.length; i++) {
        if (!isNaN(gpxObj.gpx.trk.trkseg.trkpt[i].ele)) {
          lastEle = gpxObj.gpx.trk.trkseg.trkpt[i].ele;
          break;
        }
      }

      let diffEle = 0;

      for (let i = 1; i < gpxObj.gpx.trk.trkseg.trkpt.length; i++) {
        if (isNaN(gpxObj.gpx.trk.trkseg.trkpt[i].ele)) {
          gpxObj.gpx.trk.trkseg.trkpt[i].ele = gpxObj.gpx.trk.trkseg.trkpt[i - 1].ele;
        }
        diffEle = gpxObj.gpx.trk.trkseg.trkpt[i].ele - lastEle;
        if (diffEle > 0) up += diffEle;
        else down += diffEle;
        lastEle = gpxObj.gpx.trk.trkseg.trkpt[i].ele;
        distance += this.distanceService.getDistanceFromLatLonInKm(
          gpxObj.gpx.trk.trkseg.trkpt[i].lat,
          gpxObj.gpx.trk.trkseg.trkpt[i].lon,
          gpxObj.gpx.trk.trkseg.trkpt[i - 1].lat,
          gpxObj.gpx.trk.trkseg.trkpt[i - 1].lon
        );
      }

      const totalTime =
        (Date.parse(gpxObj.gpx.trk.trkseg.trkpt[gpxObj.gpx.trk.trkseg.trkpt.length - 1].time) -
          Date.parse(gpxObj.gpx.trk.trkseg.trkpt[0].time)) /
        1000 /
        60 /
        60;

      let speed = distance / totalTime; // avg Speed in km/h
      speed = (1 / speed) * 60; // pace [min / km]

      arr.push(speed); // pace
      arr.push(up); // alt up
      arr.push(down); // alt down
      arr.push(distance * 1000); // total distance
      return arr;
    } else return [];
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

  addLayerFromGPXFile(map: Map, gpxDataString: string, colorString: string): void {
    const base64String = 'data:application/octet-stream;base64,' + gpxDataString;
    const newLayer = new VectorLayer({
      source: new VectorSource(),
      style: new Style({
        image: new CircleStyle({
          radius: 7,
          fill: new Fill({
            color: '#000',
          }),
        }),
        stroke: new Stroke({
          color: colorString,
          width: 3,
        }),
      }),
    });

    const vectorSource = new VectorSource({
      url: base64String,
      format: new GPX(),
    });

    newLayer.setSource(vectorSource);
    newLayer.setZIndex(2);

    map.addLayer(newLayer);
  }

  downloadGPX(run: FeedbackRun): void {
    let linkSource, fileName;
    const downloadLink = document.createElement('a');
    if (run.hasGPX) {
      linkSource = 'data:application/gpx+xml;base64,' + run.base64GPX;
      fileName = run.name + '.gpx';
      downloadLink.href = linkSource;
      downloadLink.download = fileName;
      downloadLink.click();
    }

    if (run.hasHeartRate) {
      linkSource = 'data:application/gpx+xml;base64,' + run.base64HeartRate;
      fileName = run.name + '_heartRate.xml';
      downloadLink.href = linkSource;
      downloadLink.download = fileName;
      downloadLink.click();
    }
  }
}
