import { Component, Input, ViewChild } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router } from '@angular/router';
import { Quiz } from '../../models/quiz.model';
import { QuizService } from '../../services/quiz.service';
import { QuizDeletionDialogComponent } from '../dialogs/quiz-deletion-dialog/quiz-deletion-dialog.component';
import { QuizEditnameDialogComponent } from '../dialogs/quiz-editname-dialog/quiz-editname-dialog.component';

@Component({
  standalone: true,
  selector: 'app-quiz-card',
  templateUrl: './quiz-card.component.html',
  imports: [MatIconModule, QuizDeletionDialogComponent, QuizEditnameDialogComponent],
})
export class QuizCardComponent {
  @Input()
  quiz: Quiz | undefined;

  @Input()
  quizIndex: number = 0;

  @ViewChild('deletionDialog')
  deletionDialog!: QuizDeletionDialogComponent;

  constructor(
    private quizService: QuizService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  get quizName() {
    return this.quiz?.name ?? '';
  }

  get questionCount() {
    const questionCount = this.quiz?.questions?.length ?? 0;
    return questionCount == 0
      ? 'No Questions'
      : questionCount == 1
        ? '1 Question'
        : `${questionCount} Questions`;
  }

  onRun() {
    this.router.navigate([this.quizIndex, 'run'], { relativeTo: this.route });
  }

  onEdit() {
    this.router.navigate([this.quizIndex, 'edit'], { relativeTo: this.route });
  }

  onDelete() {
    if (this.quizIndex == -1) {
      return;
    } else if ((this.quiz?.questions?.length ?? 0) > 1) {
      this.deletionDialog.openDialog();
    } else {
      this.quizService.deleteQuiz(this.quizIndex);
    }
  }

  onDeletionDialogClosed(confirmed: boolean) {
    if (confirmed) {
      this.quizService.deleteQuiz(this.quizIndex);
    }
  }
}