import { IControlpoint } from 'app/shared/model/controlpoint.model';
import { ControlpointInfoColumn } from 'app/shared/model/enumerations/controlpoint-info-column.model';

export interface IControlpointInfo {
  id?: number;
  imageContentType?: string;
  image?: any;
  col?: ControlpointInfoColumn;
  description?: string;
  messageKey?: string;
  sort?: number;
  controlpoints?: IControlpoint[];
}

export class ControlpointInfo implements IControlpointInfo {
  constructor(
    public id?: number,
    public imageContentType?: string,
    public image?: any,
    public col?: ControlpointInfoColumn,
    public description?: string,
    public messageKey?: string,
    public sort?: number,
    public controlpoints?: IControlpoint[]
  ) {}
}
