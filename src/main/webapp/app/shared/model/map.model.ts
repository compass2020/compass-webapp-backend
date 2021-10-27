import { ICourse } from 'app/shared/model/course.model';

export interface IMap {
  id?: number;
  mapOrigin?: string;
  mapFinal?: string;
  mapKmlOverlay?: string;
  scaleX?: number;
  scaleY?: number;
  centerX?: number;
  centerY?: number;
  rotation?: number;
  course?: ICourse;
}

export class Map implements IMap {
  constructor(
    public id?: number,
    public mapOrigin?: string,
    public mapFinal?: string,
    public mapKmlOverlay?: string,
    public scaleX?: number,
    public scaleY?: number,
    public centerX?: number,
    public centerY?: number,
    public rotation?: number,
    public course?: ICourse
  ) {}
}
