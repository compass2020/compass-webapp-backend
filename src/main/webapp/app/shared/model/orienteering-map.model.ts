import { ICourse } from 'app/shared/model/course.model';

export interface IOrienteeringMap {
  id?: number;
  mapOverlayImageContentType?: string;
  mapOverlayImage?: any;
  mapOverlayKmlContentType?: string;
  mapOverlayKml?: any;
  imageScaleX?: number;
  imageScaleY?: number;
  imageCenterX?: number;
  imageCenterY?: number;
  imageRotation?: number;
  declination?: number;
  course?: ICourse;
}

export class OrienteeringMap implements IOrienteeringMap {
  constructor(
    public id?: number,
    public mapOverlayImageContentType?: string,
    public mapOverlayImage?: any,
    public mapOverlayKmlContentType?: string,
    public mapOverlayKml?: any,
    public imageScaleX?: number,
    public imageScaleY?: number,
    public imageCenterX?: number,
    public imageCenterY?: number,
    public imageRotation?: number,
    public declination?: number,
    public course?: ICourse
  ) {}
}
