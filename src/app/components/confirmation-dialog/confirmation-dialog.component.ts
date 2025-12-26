import { Component } from '@angular/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-confirmation-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, TranslateModule],
  template: `
    <h2 mat-dialog-title>{{ 'APP.CONFIRM_LOGOUT' | translate }}</h2>
    <mat-dialog-content>
      {{ 'APP.LOGOUT_MSG' | translate }}
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="onNoClick()">{{ 'APP.CANCEL' | translate }}</button>
      <button mat-flat-button color="warn" [mat-dialog-close]="true">{{ 'APP.LOGOUT' | translate }}</button>
    </mat-dialog-actions>
  `
})
export class ConfirmationDialogComponent {
  constructor(public dialogRef: MatDialogRef<ConfirmationDialogComponent>) { }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
