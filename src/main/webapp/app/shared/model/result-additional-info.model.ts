import { IResultCourse } from 'app/shared/model/result-course.model';

export interface IResultAdditionalInfo {
  id?: number;
  gpxTrackContentType?: string;
  gpxTrack?: any;
  heartRateContentType?: string;
  heartRate?: any;
  resultCourse?: IResultCourse;
}

export class ResultAdditionalInfo implements IResultAdditionalInfo {
  constructor(
    public id?: number,
    public gpxTrackContentType?: string,
    public gpxTrack?: any,
    public heartRateContentType?: string,
    public heartRate?: any,
    public resultCourse?: IResultCourse
  ) {}
}
