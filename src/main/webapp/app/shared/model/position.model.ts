import { Moment } from 'moment';

export interface IPosition {
  uuid?: string;
  nickname?: string;
  latitude?: number;
  longitude?: number;
  timestamp?: Moment;
  sharedCourseId?: number;
  messages?: string[];
}

export class Position implements IPosition {
  constructor(
    public uuid?: string,
    public nickname?: string,
    public latitude?: number,
    public longitude?: number,
    public timestamp?: Moment,
    public sharedCourseId?: number,
    public messages?: string[]
  ) {}
}
