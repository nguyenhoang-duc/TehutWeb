import { CommonModule } from '@angular/common';
import { Component, Input, ViewChild } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router } from '@angular/router';
import { CardIconButtonComponent } from '../../../shared/components/card-icon-button.component';
import { Quiz } from '../../models/quiz.model';
import { QuizService } from '../../services/quiz.service';
import { QuizDeletionDialogComponent } from '../dialogs/quiz-deletion-dialog/quiz-deletion-dialog.component';
import { QuizEditImageDialogComponent } from '../dialogs/quiz-editimage-dialog/quiz-editimage-dialog.component';

@Component({
  standalone: true,
  selector: 'app-quiz-card',
  templateUrl: './quiz-card.component.html',
  imports: [
    MatIconModule,
    QuizDeletionDialogComponent,
    QuizEditImageDialogComponent,
    CommonModule,
    CardIconButtonComponent,
  ],
})
export class QuizCardComponent {
  @Input()
  quiz!: Quiz;

  @ViewChild('deletionDialog')
  deletionDialog!: QuizDeletionDialogComponent;

  @ViewChild('editImageDialog')
  editImageDialog!: QuizEditImageDialogComponent;

  showDeletionDialog = false;
  showEditImageDialog = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private quizService: QuizService
  ) {}

  get questionCount() {
    const questionCount = this.quiz?.questionCount ?? 0;
    return questionCount == 0
      ? 'No Questions'
      : questionCount == 1
        ? '1 Question'
        : `${questionCount} Questions`;
  }

  onRun() {
    this.router.navigate([this.quiz.id, 'run'], { relativeTo: this.route });
  }

  onEdit() {
    this.router.navigate([this.quiz.id, 'questions'], {
      relativeTo: this.route,
    });
  }

  onDelete() {
    if (this.quiz.id == '') {
      return;
    } else if (this.quiz.questionCount > 0) {
      this.showDeletionDialog = true;
      this.deletionDialog.openDialog();
    } else {
      this.quizService.deleteQuiz(this.quiz.id);
    }
  }

  onEditImageUrl() {
    this.showEditImageDialog = true;
    this.editImageDialog.openDialog(this.quiz.imagePath);
  }

  onEditQuizName(element: HTMLElement) {
    if (element.innerText) {
      this.quizService.updateQuizName(this.quiz.id, element.innerText);
    } else {
      element.innerText = this.quiz.name;
    }
  }

  onKeyDown(event: KeyboardEvent, element: HTMLElement) {
    if (event.key === 'Enter') {
      this.onEditQuizName(element);
      element.blur();
    } else if (event.key == 'Escape') {
      element.blur();
    }
  }

  onDeletionDialogClosed(confirmed: boolean) {
    if (confirmed) {
      this.quizService.deleteQuiz(this.quiz.id);
    }

    this.showDeletionDialog = false;
  }

  onEditImageDialogClosed(event: { confirmed: boolean; imageUrl: string }) {
    if (event.confirmed) {
      this.quizService.updateQuizImageUrl(this.quiz.id, event.imageUrl);
      this.quiz.imagePath = event.imageUrl;
    }

    this.showEditImageDialog = false;
  }
}
