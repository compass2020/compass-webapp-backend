export interface IMessage {
  uuid?: string;
  message?: string;
  sharedCourseId?: number;
}

export class Message implements IMessage {
  constructor(public uuid?: string, public message?: string, public sharedCourseId?: number) {}
}
