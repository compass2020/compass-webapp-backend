import { Moment } from 'moment';

export interface FeedbackRun {
  isActive: boolean;
  colorIndex: number;
  activeSpeedLine: boolean;
  activeChart: boolean;
  fetchedGPX: boolean;
  gpxJSON: any;
  heartRateJSON: any;
  id: number;
  name: string;
  startTime: Moment;
  totalTime: number;
  sectorTimes: number[];
  sectorWasSkipped: boolean[];
  lastSectorWasSkipped: boolean[];
  switchAppCounter: number;
  showPositionCounter: number;
  avgSpeed: number;
  distance: number;
  altUp: number;
  altDown: number;
  answers: boolean[];
  nrOfQuestions: number;
  correctAnswers: number;
  hasGPX: boolean;
  hasHeartRate: boolean;
  base64GPX: string;
  base64HeartRate: string;
  controlPointWasForceSkipped: boolean[];
  nrOfForceSkips: number;
  forceSkippedTooltip: string;
  nrOfBorgSkipped: number;
}
