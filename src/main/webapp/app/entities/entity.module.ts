import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'course',
        loadChildren: () => import('./course/course.module').then(m => m.CompassCourseModule),
      },
      {
        path: 'controlpoint',
        loadChildren: () => import('./controlpoint/controlpoint.module').then(m => m.CompassControlpointModule),
      },
      {
        path: 'question',
        loadChildren: () => import('./question/question.module').then(m => m.CompassQuestionModule),
      },
      {
        path: 'category',
        loadChildren: () => import('./category/category.module').then(m => m.CompassCategoryModule),
      },
      {
        path: 'answer',
        loadChildren: () => import('./answer/answer.module').then(m => m.CompassAnswerModule),
      },
      {
        path: 'orienteering-map',
        loadChildren: () => import('./orienteering-map/orienteering-map.module').then(m => m.CompassOrienteeringMapModule),
      },
      {
        path: 'shared-course',
        loadChildren: () => import('./shared-course/shared-course.module').then(m => m.CompassSharedCourseModule),
      },
      {
        path: 'result-course',
        loadChildren: () => import('./result-course/result-course.module').then(m => m.CompassResultCourseModule),
      },
      {
        path: 'result-controlpoint',
        loadChildren: () => import('./result-controlpoint/result-controlpoint.module').then(m => m.CompassResultControlpointModule),
      },
      {
        path: 'result-additional-info',
        loadChildren: () => import('./result-additional-info/result-additional-info.module').then(m => m.CompassResultAdditionalInfoModule),
      },
      {
        path: 'result-question',
        loadChildren: () => import('./result-question/result-question.module').then(m => m.CompassResultQuestionModule),
      },
      {
        path: 'result-answer',
        loadChildren: () => import('./result-answer/result-answer.module').then(m => m.CompassResultAnswerModule),
      },
      {
        path: 'controlpoint-info',
        loadChildren: () => import('./controlpoint-info/controlpoint-info.module').then(m => m.CompassControlpointInfoModule),
      },
      {
        path: 'shared-course-qr-code',
        loadChildren: () => import('./shared-course-qr-code/shared-course-qr-code.module').then(m => m.CompassSharedCourseQrCodeModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class CompassEntityModule {}
