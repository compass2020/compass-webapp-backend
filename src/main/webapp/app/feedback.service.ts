import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class FeedbackService {
  resultIDs: number[];
  courseIDs: number[];

  constructor() {
    this.resultIDs = [];
    this.courseIDs = [];
  }

  addResult(id: number): void {
    this.resultIDs.push(id);
  }

  addCourse(id: number): void {
    if (!this.courseIDs.includes(id)) this.courseIDs.push(id);
  }

  reset(): void {
    this.resultIDs = [];
    this.courseIDs = [];
  }
}
