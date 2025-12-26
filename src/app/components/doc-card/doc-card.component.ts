import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { DocPreviewComponent } from '../doc-preview/doc-preview.component';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-doc-card',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatIconModule, TranslateModule],
  templateUrl: './doc-card.component.html',
  styleUrls: ['./doc-card.component.css']
})
export class DocCardComponent {
  @Input() doc: any;
  @Output() delete = new EventEmitter<string>();
  @Output() edit = new EventEmitter<any>();

  isMasked: boolean = true;
  isCopied: boolean = false;

  constructor(private dialog: MatDialog) { }

  toggleMask() {
    this.isMasked = !this.isMasked;
  }

  copyToClipboard() {
    if (this.doc?.docNumber) {
      navigator.clipboard.writeText(this.maskedNumber).then(() => {
        this.isCopied = true;
        setTimeout(() => {
          this.isCopied = false;
        }, 2000);
      });
    }
  }

  onEdit() {
    this.edit.emit(this.doc);
  }

  onDelete() {
    if (confirm('Are you sure you want to delete this document?')) {
      this.delete.emit(this.doc._id);
    }
  }

  onView() {
    this.dialog.open(DocPreviewComponent, {
      data: this.doc,
      width: '80%',
      maxWidth: '800px',
      maxHeight: '90vh'
    });
  }

  get maskedNumber(): string {
    if (!this.doc?.docNumber) return '';
    if (!this.isMasked) return this.doc.docNumber;

    // Simple masking: show last 4 chars
    const num = this.doc.docNumber;
    if (num.length <= 4) return num;
    return '*'.repeat(num.length - 4) + num.slice(-4);
  }
}
