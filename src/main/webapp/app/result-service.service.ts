import { IResultCourse } from 'app/shared/model/result-course.model';
import { FeedbackRun } from './feedback-run';
import { Injectable } from '@angular/core';
import { Sort } from '@angular/material/sort';
import moment from 'moment';

@Injectable({
  providedIn: 'root',
})
export class ResultServiceService {
  constructor() {}

  // include this function in view and feedback component --> test if questions and different sectorCounts are working with the template...
  prepareForFeedbackTable(
    resultCourse: IResultCourse,
    maxQuestionCount: number,
    questionTexts: string[],
    maxSectorCount: number
  ): FeedbackRun {
    resultCourse.resultControlpoints.sort((a, b) => (a.sequence > b.sequence ? 1 : -1));

    const sectorTimeArr = [];
    const sectorWasSkipped = [];
    const lastSectorWasSkipped = [];
    const controlPointWasForceSkipped = [];
    let forceSkippedTooltip = '';
    let questionCount = 0;
    let nrOfQuestions = 0;
    let correctAnswers = 0;
    const answerArr = [];
    for (let i = 0; i < resultCourse.resultControlpoints.length; i++) {
      if (i < resultCourse.resultControlpoints.length - 1) {
        const finishMoment = moment(resultCourse.resultControlpoints[i + 1].timeReached);
        const startMoment = moment(resultCourse.resultControlpoints[i].timeReached);

        const difference = finishMoment.diff(startMoment);

        if (difference !== 0) sectorWasSkipped.push(false);
        else sectorWasSkipped.push(true);
        sectorTimeArr.push(difference);
      }

      questionCount += resultCourse.resultControlpoints[i].resultQuestions.length;
      controlPointWasForceSkipped.push(resultCourse.resultControlpoints[i].forceSkipped);
      if (resultCourse.resultControlpoints[i].forceSkipped) forceSkippedTooltip = forceSkippedTooltip + '#' + i + ' ';

      for (let j = 0; j < resultCourse.resultControlpoints[i].resultQuestions.length; j++) {
        answerArr.push(resultCourse.resultControlpoints[i].resultQuestions[j].answeredCorrectly);
        if (answerArr[answerArr.length - 1] !== null) {
          nrOfQuestions++;
          if (answerArr[answerArr.length - 1]) correctAnswers++;
        }
      }
    }

    if (maxQuestionCount < questionCount) {
      maxQuestionCount = questionCount;
      questionTexts = [];
      for (let i = 0; i < resultCourse.resultControlpoints.length; i++) {
        for (let j = 0; j < resultCourse.resultControlpoints[i].resultQuestions.length; j++) {
          questionTexts.push(resultCourse.resultControlpoints[i].resultQuestions[j].text);
        }
      }
    }
    lastSectorWasSkipped.push(false);
    for (let i = 0; i < sectorWasSkipped.length - 1; i++) {
      lastSectorWasSkipped.push(sectorWasSkipped[i]);
    }

    if (sectorTimeArr.length > maxSectorCount) maxSectorCount = sectorTimeArr.length;

    const feedbackRun = {
      isActive: false,
      fetchedGPX: false,
      activeChart: false,
      activeSpeedLine: false,
      gpxJSON: undefined,
      heartRateJSON: undefined,
      colorIndex: -1,
      id: resultCourse.id,
      name: resultCourse.nickName,
      startTime: resultCourse.timeStampStarted,
      totalTime: resultCourse.totalDurationInMillis,
      sectorTimes: sectorTimeArr,
      showPositionCounter: resultCourse.showPositionCounter,
      switchAppCounter: resultCourse.switchAppCounter,
      sectorWasSkipped,
      lastSectorWasSkipped,
      distance: undefined,
      avgSpeed: undefined,
      altUp: undefined,
      altDown: undefined,
      answers: answerArr,
      nrOfQuestions,
      correctAnswers,
      hasGPX: false,
      hasHeartRate: false,
      base64GPX: undefined,
      base64HeartRate: undefined,
      controlPointWasForceSkipped,
      nrOfForceSkips: controlPointWasForceSkipped.filter(Boolean).length,
      forceSkippedTooltip,
      nrOfBorgSkipped: sectorWasSkipped.filter(Boolean).length,
    };
    return feedbackRun;
  }

  sortData(sort: Sort, feedbackRuns: FeedbackRun[]): FeedbackRun[] {
    const data = feedbackRuns.slice();
    if (!sort.active || sort.direction === '') {
      /* this.sortedRuns = data; */
      return feedbackRuns;
    }

    return data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'name':
          return this.compare(a.name.toLowerCase(), b.name.toLowerCase(), isAsc);
        case 'totalTime':
          return this.compare(a.totalTime, b.totalTime, isAsc);
        case 'startTime':
          return this.compare(a.startTime.valueOf(), b.startTime.valueOf(), isAsc);
        case 'avgSpeed':
          if (a.avgSpeed === undefined) return 1;
          if (b.avgSpeed === undefined) return -1;
          return this.compare(a.avgSpeed, b.avgSpeed, isAsc);
        case 'distance':
          if (a.distance === undefined) return 1;
          if (b.distance === undefined) return -1;
          return this.compare(a.distance, b.distance, isAsc);
        case 'altUp':
          if (a.altUp === undefined) return 1;
          if (b.altUp === undefined) return -1;
          return this.compare(a.altUp, b.altUp, isAsc);
        case 'altDown':
          if (a.altDown === undefined) return 1;
          if (b.altDown === undefined) return -1;
          return this.compare(a.altDown, b.altDown, isAsc);
        case 'correctAnswers':
          return this.compare(a.correctAnswers, b.correctAnswers, isAsc);
        case 'forceSkipCounter':
          return this.compare(a.nrOfForceSkips, b.nrOfForceSkips, isAsc);
        default:
          try {
            if (sort.active.startsWith('sector')) {
              // sectorTime4
              const sectorIndex = parseInt(sort.active.substr(10), 10);
              return this.compare(a.sectorTimes[sectorIndex], b.sectorTimes[sectorIndex], isAsc);
            } else {
              // question4
              const questionIndex = parseInt(sort.active.substr(8), 10);
              return this.compareBoolean(a.answers[questionIndex], b.answers[questionIndex], isAsc);
            }
          } catch {
            return 0;
          }
      }
    });
  }

  compareBoolean(a: boolean, b: boolean, isAsc: boolean): number {
    return (a === b ? 0 : a ? -1 : 1) * (isAsc ? 1 : -1);
  }

  compare(a: number | string, b: number | string, isAsc: boolean): number {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }
}
