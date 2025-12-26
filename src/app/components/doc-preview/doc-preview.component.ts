import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-doc-preview',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule, TranslateModule],
  template: `
    <h2 mat-dialog-title>{{ data.title }}</h2>
    <mat-dialog-content class="preview-content">
      <div *ngIf="isImage" class="image-preview">
        <img [src]="data.fileUrl" [alt]="data.title">
      </div>
      
      <div *ngIf="isPdf" class="pdf-preview">
        <embed [src]="safeUrl" type="application/pdf" width="100%" height="600px" />
        <div class="pdf-fallback" style="margin-top: 10px; text-align: center;">
            <p>{{ 'APP.PDF_FALLBACK' | translate }}</p>
            <a [href]="data.fileUrl" [download]="data.title + '.pdf'" mat-raised-button color="primary">
                {{ 'APP.DOWNLOAD_PDF' | translate }} <mat-icon>download</mat-icon>
            </a>
        </div>
      </div>

      <div *ngIf="!isImage && !isPdf" class="unsupported-preview">
        <p>{{ 'APP.PREVIEW_UNSUPPORTED' | translate }}</p>
        <a [href]="data.fileUrl" download mat-button color="primary">{{ 'APP.DOWNLOAD' | translate }}</a>
      </div>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>{{ 'APP.CLOSE' | translate }}</button>
    </mat-dialog-actions>
  `,
  styles: [`
    .preview-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      min-width: 300px;
      min-height: 200px;
      padding: 1rem;
      overflow: hidden;
    }
    .image-preview img {
      max-width: 100%;
      max-height: 70vh;
      object-fit: contain;
    }
    .pdf-preview {
      width: 100%;
      height: 100%;
      min-width: min(600px, 100%);
    }
    embed {
        border: 1px solid #ccc;
        border-radius: 4px;
    }
  `]
})
export class DocPreviewComponent {
  safeUrl: SafeResourceUrl;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private sanitizer: DomSanitizer
  ) {
    this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(data.fileUrl);
  }

  get isImage(): boolean {
    const url = this.data.fileUrl;
    return url.startsWith('data:image') || url.match(/\.(jpeg|jpg|gif|png)$/) != null;
  }

  get isPdf(): boolean {
    const url = this.data.fileUrl;
    return url.startsWith('data:application/pdf') || url.endsWith('.pdf');
  }
}
