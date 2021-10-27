import { IQuestion } from 'app/shared/model/question.model';
import { IControlpointInfo } from 'app/shared/model/controlpoint-info.model';
import { ICourse } from 'app/shared/model/course.model';

export interface IControlpoint {
  id?: number;
  sequence?: number;
  controlCode?: number;
  latitude?: number;
  longitude?: number;
  elevation?: number;
  radius?: number;
  skippable?: boolean;
  team?: boolean;
  qrCode?: string;
  description?: string;
  questions?: IQuestion[];
  controlpointInfos?: IControlpointInfo[];
  course?: ICourse;
}

export class Controlpoint implements IControlpoint {
  constructor(
    public id?: number,
    public sequence?: number,
    public controlCode?: number,
    public latitude?: number,
    public longitude?: number,
    public elevation?: number,
    public radius?: number,
    public skippable?: boolean,
    public team?: boolean,
    public qrCode?: string,
    public description?: string,
    public questions?: IQuestion[],
    public controlpointInfos?: IControlpointInfo[],
    public course?: ICourse
  ) {
    this.skippable = this.skippable || false;
    this.team = this.team || false;
  }
}
