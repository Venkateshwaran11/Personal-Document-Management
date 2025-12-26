import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { Contact } from '../../services/contact.service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
    selector: 'app-contact-dialog',
    standalone: true,
    imports: [
        CommonModule,
        MatDialogModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatButtonModule,
        FormsModule,
        TranslateModule
    ],
    template: `
    <h2 mat-dialog-title>{{ (data ? 'CONTACTS.EDIT' : 'CONTACTS.ADD') | translate }}</h2>
    <mat-dialog-content>
      <form #contactForm="ngForm">
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>{{ 'CONTACTS.NAME' | translate }}</mat-label>
          <input matInput [(ngModel)]="contact.name" name="name" required>
        </mat-form-field>
        
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>{{ 'CONTACTS.MOBILE' | translate }}</mat-label>
          <input matInput [(ngModel)]="contact.mobileNumber" name="mobileNumber" required>
        </mat-form-field>
        
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>{{ 'CONTACTS.EMAIL' | translate }}</mat-label>
          <input matInput [(ngModel)]="contact.email" name="email" type="email">
        </mat-form-field>
        
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>{{ 'CONTACTS.CATEGORY' | translate }}</mat-label>
          <mat-select [(ngModel)]="contact.category" name="category">
            <mat-option value="Personal">Personal</mat-option>
            <mat-option value="Work">Work</mat-option>
            <mat-option value="Emergency">Emergency</mat-option>
            <mat-option value="Other">Other</mat-option>
          </mat-select>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>{{ 'CONTACTS.NOTES' | translate }}</mat-label>
          <textarea matInput [(ngModel)]="contact.notes" name="notes"></textarea>
        </mat-form-field>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="onCancel()">{{ 'CONTACTS.CANCEL' | translate }}</button>
      <button mat-raised-button color="primary" [disabled]="!contactForm.form.valid" (click)="onSave()">
        {{ 'CONTACTS.SAVE' | translate }}
      </button>
    </mat-dialog-actions>
  `,
    styles: [`
    .full-width { width: 100%; margin-bottom: 0.5rem; }
    mat-dialog-content { padding-top: 1rem !important; }
  `]
})
export class ContactDialogComponent implements OnInit {
    contact: Contact = {
        name: '',
        mobileNumber: '',
        email: '',
        category: 'Personal',
        notes: ''
    };

    constructor(
        public dialogRef: MatDialogRef<ContactDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: Contact | null
    ) { }

    ngOnInit() {
        if (this.data) {
            this.contact = { ...this.data };
        }
    }

    onCancel() {
        this.dialogRef.close();
    }

    onSave() {
        this.dialogRef.close(this.contact);
    }
}
