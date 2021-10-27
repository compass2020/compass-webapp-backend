/* eslint-disable @typescript-eslint/no-this-alias */
import { TranslateService } from '@ngx-translate/core';
import Legend from 'ol-ext/control/Legend';
import { Injectable } from '@angular/core';
import LineString from 'ol/geom/LineString';
import VectorLayer from 'ol/layer/Vector';
import { transform } from 'ol/proj';
import Feature from 'ol/Feature';
import VectorSource from 'ol/source/Vector';
import Map from 'ol/Map';
import Style from 'ol/style/Style';
import Stroke from 'ol/style/Stroke';
import Fill from 'ol/style/Fill';

@Injectable({
  providedIn: 'root',
})
export class SpeedlineServiceService {
  minMax: number[];
  constructor(private translate: TranslateService) {}

  createFlowLine(gpxObj: any, gpxVectorSource: VectorSource, map: Map): Legend {
    if (gpxObj.gpx.trk.trkseg !== '') {
      this.minMax = this.getMinMax(gpxObj);

      if (gpxVectorSource) gpxVectorSource.clear();
      const gpxVectorLayer = new VectorLayer({
        source: gpxVectorSource,
      });

      for (let i = 1; i < gpxObj.gpx.trk.trkseg.trkpt.length; i++) {
        const lineFeature = new LineString([
          transform([gpxObj.gpx.trk.trkseg.trkpt[i - 1].lon, gpxObj.gpx.trk.trkseg.trkpt[i - 1].lat], 'EPSG:4326', 'EPSG:3857'),
          transform([gpxObj.gpx.trk.trkseg.trkpt[i].lon, gpxObj.gpx.trk.trkseg.trkpt[i].lat], 'EPSG:4326', 'EPSG:3857'),
        ]);
        const featureLine = new Feature(lineFeature);
        featureLine.set('speed', gpxObj.gpx.trk.trkseg.trkpt[i - 1].speed);
        featureLine.set('min', this.minMax[0]);
        featureLine.set('max', this.minMax[1]);
        featureLine.setStyle(this.customStyleFunction);
        // featureLine.setStyle(this.styleDefault);
        gpxVectorSource.addFeature(featureLine);
      }
      gpxVectorLayer.setZIndex(3);
      map.addLayer(gpxVectorLayer);
      const flowLineLegend = this.createSpeedLineLegend();
      map.addControl(flowLineLegend);
      return flowLineLegend;
    }
  }

  getMinMax(gpxObj): number[] {
    const minMax = [-1, -1];
    gpxObj.gpx.trk.trkseg.trkpt.forEach(trkpt => {
      if (minMax[0] === -1 || minMax[0] > trkpt.speed) minMax[0] = trkpt.speed;
      if (minMax[1] === -1 || minMax[1] < trkpt.speed) minMax[1] = trkpt.speed;
    });
    return minMax;
  }

  customStyleFunction(feature): Style {
    const speed = feature.get('speed');
    const min = feature.get('min');
    const max = feature.get('max');
    const dSpeed = (255 * (speed - min)) / (max - min);
    const lineColor = [255 - dSpeed, dSpeed, 0];
    return new Style({
      stroke: new Stroke({ color: lineColor, width: 5 }),
    });
  }

  createSpeedLineLegend(): Legend {
    const self = this;
    const flowLineLegend = new Legend({
      title: this.translate.instant('results.speed'),
      style(f): Style[] {
        const dh = f.get('dh');
        return [
          new Style({
            fill: new Fill({
              color: self.getColor(dh),
            }),
          }),
        ];
      },
      collapsible: false,
      margin: 0,
      size: [10, 20],
    });
    flowLineLegend.addRow({
      title: Math.round(this.minMax[1] * 3.6 * 100) / 100 + 'km/h',
      properties: { dh: 255 },
      typeGeom: 'Polygon',
    });
    flowLineLegend.addRow({ title: '', properties: { dh: 224 }, typeGeom: 'Polygon' });
    flowLineLegend.addRow({ title: '', properties: { dh: 192 }, typeGeom: 'Polygon' });
    flowLineLegend.addRow({ title: '', properties: { dh: 160 }, typeGeom: 'Polygon' });
    flowLineLegend.addRow({ title: '', properties: { dh: 128 }, typeGeom: 'Polygon' });
    flowLineLegend.addRow({ title: '', properties: { dh: 96 }, typeGeom: 'Polygon' });
    flowLineLegend.addRow({ title: '', properties: { dh: 64 }, typeGeom: 'Polygon' });
    flowLineLegend.addRow({ title: '', properties: { dh: 32 }, typeGeom: 'Polygon' });
    flowLineLegend.addRow({
      title: Math.round(this.minMax[0] * 3.6 * 100) / 100 + 'km/h',
      properties: { dh: 0 },
      typeGeom: 'Polygon',
    });
    return flowLineLegend;
  }

  getColor(dh): number[] {
    return [255 - dh, dh, 0];
  }
}
