import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { ICategory } from 'app/shared/model/category.model';
import { HttpResponse } from '@angular/common/http';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { CategoryService } from 'app/entities/category/category.service';
import { QuestionService } from 'app/entities/question/question.service';
import { IQuestion } from 'app/shared/model/question.model';
import { Observable } from 'rxjs';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'jhi-manage-questions',
  templateUrl: './manage-questions.component.html',
  styleUrls: ['manage-questions.component.scss'],
})
export class ManageQuestionsComponent implements OnInit {
  @ViewChild('template') templateRef: TemplateRef<any>;
  questions!: IQuestion[];
  allQuestions!: IQuestion[];
  categories!: ICategory[];
  deleteQuestion: IQuestion;
  modalRef: NgbModalRef;
  itemsPerPage = '10';
  orderBy = 'date';
  orderAsc = false;
  page = 1;

  constructor(
    protected categoryService: CategoryService,
    protected questionService: QuestionService,
    private toastr: ToastrService,
    private translate: TranslateService,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.questionService.getQuestionsCreatedByMe().subscribe((res: HttpResponse<IQuestion[]>) => {
      this.questions = res.body || [];
      this.allQuestions = this.questions;
      this.orderData();
    });

    this.categoryService.query().subscribe((res: HttpResponse<ICategory[]>) => (this.categories = res.body || []));
  }

  successfullyCreatedQuestion(newQuestion: IQuestion): void {
    this.allQuestions.push(newQuestion);
    this.questions = this.allQuestions;
    this.orderData();
  }

  orderData(): void {
    switch (this.orderBy) {
      case 'date': {
        this.questions.sort((a, b) => {
          return this.compare(a.id, b.id, this.orderAsc);
        });
        break;
      }
      case 'type': {
        this.questions.sort((a, b) => {
          return this.compare(a.type, b.type, this.orderAsc);
        });
        break;
      }
      case 'text': {
        this.questions.sort((a, b) => {
          return this.compare(a.text.toLowerCase(), b.text.toLowerCase(), this.orderAsc);
        });
        break;
      }
    }
  }

  compare(a: number | string, b: number | string, isAsc: boolean): number {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }

  onSearchChange(): void {
    const text = (document.getElementById('searchbox') as HTMLInputElement).value.toLowerCase();
    this.questions = this.allQuestions.filter(question => question.text.toLowerCase().includes(text));
    this.orderData();
  }

  removeQuestion(question: IQuestion): void {
    this.deleteQuestion = question;
    this.modalRef = this.modalService.open(this.templateRef);
  }

  confirm(): void {
    this.subscribeToDeleteResponse(this.questionService.delete(this.deleteQuestion.id));
    this.modalRef.close();
  }

  decline(): void {
    this.modalRef.close();
    this.deleteQuestion = null;
  }

  protected subscribeToDeleteResponse(result: Observable<HttpResponse<IQuestion>>): void {
    result.subscribe(
      res => {
        if (res.status === 204) {
          // delete successful --> remove from list
          const index = this.allQuestions.indexOf(this.deleteQuestion);
          if (index > -1) {
            this.allQuestions.splice(index, 1);
            this.questions = this.allQuestions;
            this.orderData();
            this.toastr.info('', this.translate.instant('create-course.questionDeleted'), {
              positionClass: 'toast-top-center',
              timeOut: 5000,
            });
          }
        }
      },
      () => {
        this.toastr.warning('', this.translate.instant('create-course.questionInUse'), {
          positionClass: 'toast-top-center',
          timeOut: 5000,
        });
      }
    );
  }
}
