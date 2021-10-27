import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Question, IQuestion } from 'app/shared/model/question.model';
import { QuestionType } from 'app/shared/model/enumerations/question-type.model';
import { IAnswer } from 'app/shared/model/answer.model';
import { QuestionService } from 'app/entities/question/question.service';
import { Category } from 'app/shared/model/category.model';
import { Difficulty } from 'app/shared/model/enumerations/difficulty.model';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

@Component({
  selector: 'jhi-create-question',
  templateUrl: './create-question.component.html',
  styleUrls: ['./create-question.component.scss'],
})
export class CreateQuestionComponent implements OnInit {
  @Input() categories: Category[];
  @Output() successfullyCreated = new EventEmitter<Question>();
  question: Question;
  selectedQuestionType!: QuestionType;
  selectedQuestionDifficulty!: Difficulty;
  selectedCategoryIndex!: number;
  questionDifficulties = Difficulty;
  questionTypes = QuestionType;
  questionIsPublic = false;

  constructor(private questionService: QuestionService, private toastr: ToastrService, private translate: TranslateService) {}

  getAllQuestionTypes(): Array<string> {
    return Object.keys(this.questionTypes);
  }

  getAllQuestionDifficulties(): Array<string> {
    return Object.keys(this.questionDifficulties);
  }

  ngOnInit(): void {
    this.question = {} as Question;
    this.question.personal = true;
    this.question.answers = [] as IAnswer[];
    this.question.type = QuestionType.SINGLE; // Default value
    this.question.text = ''; // Default value
    // this.question.keepOrderOfAnswers = false; // Default value
    this.addAnswer();
  }

  drop(event: CdkDragDrop<string[]>): void {
    moveItemInArray(this.question.answers, event.previousIndex, event.currentIndex);
  }

  typeChanged(event): void {
    if (event.value === 'SINGLE') {
      // if change to single-choice and more than one is marked as correct set all flags to false
      let correctAnswers = 0;
      for (let i = 0; i < this.question.answers.length; i++) {
        if (this.question.answers[i].correct === true) {
          correctAnswers++;
        }
      }

      if (correctAnswers !== 1) {
        for (let i = 0; i < this.question.answers.length; i++) {
          this.question.answers[i].correct = false;
        }
      } else {
        // set all to false --> should be improved so the checked answer stays checked
        for (let i = 0; i < this.question.answers.length; i++) {
          this.question.answers[i].correct = false;
        }
      }
    }
  }

  addAnswer(): void {
    const newAnser = {} as IAnswer;
    newAnser.correct = false; // Default value
    newAnser.text = ''; // Default value
    this.question.answers.push(newAnser);
  }

  singleChoiceChanged(event, index): void {
    for (let i = 0; i < this.question.answers.length; i++) {
      this.question.answers[i].correct = false;
    }
    this.question.answers[index].correct = true;
  }

  checkboxChanged(event, index): void {
    this.question.answers[index].correct = event.checked;
  }

  saveQuestion(): boolean {
    // Check if Amount of Answers is ok!
    this.question.type = this.selectedQuestionType;
    // this.question.personal = !this.questionIsPublic;
    this.question.personal = true;
    let correctAnswers = 0;
    for (let i = 0; i < this.question.answers.length; i++) {
      if (this.question.answers[i].text === '') {
        this.question.answers.splice(i, 1);
        i--;
      }
    }

    switch (this.question.type) {
      case QuestionType.SINGLE: // single choice
        for (let i = 0; i < this.question.answers.length; i++) {
          if (this.question.answers[i].correct === true) correctAnswers++;
        }

        if (correctAnswers !== 1) {
          this.toastr.warning('', this.translate.instant('create-course.singleChoiceOneAnswerCorrect'), {
            positionClass: 'toast-top-center',
            timeOut: 5000,
          });
          return false;
        }
        break;
      case QuestionType.MULTIPLE: // multiple choice
        // check if at least one answer is correct
        for (let i = 0; i < this.question.answers.length; i++) {
          if (this.question.answers[i].correct === true) correctAnswers++;
        }

        if (correctAnswers < 1) {
          this.toastr.warning('', this.translate.instant('create-course.atLeastOneCorrect'), {
            positionClass: 'toast-top-center',
            timeOut: 5000,
          });
          return false;
        }
        break;
      case QuestionType.INPUT: // delete all answers but not the first
        this.question.answers.forEach(answer => {
          answer.correct = true;
        });

        if (this.question.answers.length < 1) {
          this.toastr.warning('', this.translate.instant('create-course.addCorrectAnswer'), {
            positionClass: 'toast-top-center',
            timeOut: 5000,
          });
          return false;
        }
        break;
    }

    this.question.difficulty = this.selectedQuestionDifficulty;
    this.question.category = this.categories[this.selectedCategoryIndex];

    if (!this.question.category) {
      this.toastr.warning('', this.translate.instant('create-course.selectCategory'), {
        positionClass: 'toast-top-center',
        timeOut: 5000,
      });
      return false;
    }
    if (!this.question.difficulty) {
      this.toastr.warning('', this.translate.instant('create-course.selectDifficulty'), {
        positionClass: 'toast-top-center',
        timeOut: 5000,
      });
      return false;
    }

    this.subscribeToSaveResponse(this.questionService.create(this.question));
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IQuestion>>): void {
    result.subscribe(
      res => this.onSaveSuccess(res),
      () => this.onSaveError()
    );
  }

  protected onSaveSuccess(response: HttpResponse<IQuestion>): void {
    // response.body;
    this.successfullyCreated.emit(response.body);
    this.toastr.success(this.translate.instant('create-course.questionCreated'), this.translate.instant('success'), {
      positionClass: 'toast-top-center',
      timeOut: 5000,
    });
  }

  protected onSaveError(): void {
    this.toastr.error('', this.translate.instant('error.general'), {
      positionClass: 'toast-top-center',
      timeOut: 5000,
    });
  }
}
